import { wallet, initWallet } from "./wallet";
import { getTxBuilder } from "./utils";

export async function sendValue(
  recipient: string,
  assets: { unit: string; quantity: string }[]
) {
  await initWallet();

  const lovelaceAsset = assets.find((a) => a.unit === "lovelace");

  if (lovelaceAsset && Number(lovelaceAsset.quantity) < 1000000) {
    console.log("❌ You must send at least 1 ADA (1,000,000 lovelace).");
    return;
  }

  const utxos = await wallet.getUtxos();
  const changeAddress = await wallet.getChangeAddress();
  const txBuilder = getTxBuilder();

  const unsignedTx = await txBuilder
    .txOut(recipient, assets)
    .changeAddress(changeAddress)
    .selectUtxosFrom(utxos)
    .complete();

  const signedTx = await wallet.signTx(unsignedTx);
  const txHash = await wallet.submitTx(signedTx);

  console.log("✅ Transaction submitted!");
  console.log("🔗 Transaction Hash:", txHash);
}
