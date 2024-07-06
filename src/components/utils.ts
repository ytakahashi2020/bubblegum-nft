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

  // ツリーを作成　ここから
  const merkleTree = generateSigner(umi);

  const builder = await createTree(umi, {
    merkleTree,
    maxDepth: 14,
    maxBufferSize: 64,
  });

  await builder.sendAndConfirm(umi);
  console.log("asset =>", merkleTree.publicKey.toString());
  // ツリーを作成　ここから

  // ツリーを取得 ここから
  const merkleTreeAccount = await fetchMerkleTree(umi, merkleTree.publicKey);
  console.log("merkleTreeAccount =>", merkleTreeAccount);

  const treeConfig = await fetchTreeConfigFromSeeds(umi, {
    merkleTree: merkleTree.publicKey,
  });
  console.log("treeConfig =>", treeConfig);
  // ツリーを取得 ここまで

  // NFTを作成 ここから
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
  // NFTを作成 ここまで

  // NFTを取得 ここから
  const leaf: LeafSchema = await parseLeafFromMintV1Transaction(umi, signature);
  const assetId = findLeafAssetIdPda(umi, {
    merkleTree: merkleTree.publicKey,
    leafIndex: leaf.nonce,
  });

  console.log("assetId =>", assetId);
  // NFTを取得 ここまで

  return merkleTree.publicKey.toString();
};
