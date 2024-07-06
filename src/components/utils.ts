import { keypairIdentity, generateSigner } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createV1 } from "@metaplex-foundation/mpl-core";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { mplBubblegum } from "@metaplex-foundation/mpl-bubblegum";
import { createTree } from "@metaplex-foundation/mpl-bubblegum";
import {
  fetchMerkleTree,
  fetchTreeConfigFromSeeds,
} from "@metaplex-foundation/mpl-bubblegum";

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

  return merkleTree.publicKey.toString();
};
