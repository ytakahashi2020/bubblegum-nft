import { keypairIdentity, generateSigner } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createV1 } from "@metaplex-foundation/mpl-core";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { mplBubblegum } from "@metaplex-foundation/mpl-bubblegum";
import { createTree } from "@metaplex-foundation/mpl-bubblegum";
import {
  fetchMerkleTree,
  fetchTreeConfigFromSeeds,
  mintV1,
  findLeafAssetIdPda,
  parseLeafFromMintV1Transaction,
  LeafSchema,
} from "@metaplex-foundation/mpl-bubblegum";
import { none } from "@metaplex-foundation/umi";

export const createBubbleGumTrees = async (wallet: any) => {
  const endpoint = "https://api.devnet.solana.com";
  const umi = createUmi(endpoint).use(mplBubblegum());

  umi.use(walletAdapterIdentity(wallet));

  const merkleTree = generateSigner(umi);

  const builder = await createTree(umi, {
    merkleTree,
    maxDepth: 14,
    maxBufferSize: 64,
  });

  await builder.sendAndConfirm(umi);
  console.log("asset =>", merkleTree.publicKey.toString());

  const merkleTreeAccount = await fetchMerkleTree(umi, merkleTree.publicKey);
  console.log("merkleTreeAccount =>", merkleTreeAccount);

  const treeConfig = await fetchTreeConfigFromSeeds(umi, {
    merkleTree: merkleTree.publicKey,
  });
  console.log("treeConfig =>", treeConfig);

  await new Promise((resolve) => setTimeout(resolve, 10000));
  try {
    console.log("Attempting to mint V1...");
    const { signature } = await mintV1(umi, {
      leafOwner: wallet.publicKey,
      merkleTree: merkleTree.publicKey,
      metadata: {
        name: "My Compressed NFT",
        uri: "https://example.com/my-cnft.json",
        sellerFeeBasisPoints: 500, // 5%
        collection: none(),
        creators: [
          { address: umi.identity.publicKey, verified: false, share: 100 },
        ],
      },
    }).sendAndConfirm(umi);

    console.log("Mint signature =>", signature);
    const leaf: LeafSchema = await parseLeafFromMintV1Transaction(
      umi,
      signature
    );
    const assetId = findLeafAssetIdPda(umi, {
      merkleTree: merkleTree.publicKey,
      leafIndex: leaf.nonce,
    });

    console.log("assetId =>", assetId);
  } catch (error) {
    console.error("Error during minting:", error);
  }

  return merkleTree.publicKey.toString();
};
