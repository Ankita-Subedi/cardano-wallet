import { Transaction, ForgeScript, Mint, AssetMetadata } from "@meshsdk/core";
import { wallet } from "./wallet";
import { provider } from "./provider";

export async function mintDemoToken() {
  const address = await wallet.getUsedAddresses().then((a) => a[0]);
  const forgingScript = ForgeScript.withOneSignature(address);

  const assetMetadata: AssetMetadata = {
    name: "New Demo NFT",
    // image: "ipfs://QmRzicpReutwCkM6aotuKjErFCUD213DpwPq6ByuzMJaua",
    image: "ipfs://Qmbx45x7uZZTS44bhQzKZhoxEHGbLcgGDeg2S9nyVz9Twi",
    mediaType: "image/jpg",
    description: "This is Ankita's first minted NFT using Mesh SDK!",
  };

  const asset: Mint = {
    assetName: "NewImg",
    assetQuantity: "1",
    metadata: assetMetadata,
    label: "721",
    recipient: address,
  };

  const tx = new Transaction({ initiator: wallet, fetcher: provider });
  tx.mintAsset(forgingScript, asset);

  const unsignedTx = await tx.build();
  const signedTx = await wallet.signTx(unsignedTx);
  const txHash = await wallet.submitTx(signedTx);

  console.log("✅ Minted successfully!");
  console.log("🔗 Tx Hash:", txHash);
}
