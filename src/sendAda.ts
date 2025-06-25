import { wallet, initWallet } from "./wallet";
import { getTxBuilder } from "./utils";

export async function sendValue(
  recipient: string,
  assets: { unit: string; quantity: string }[]
) {
  await initWallet();

  const utxos = await wallet.getUtxos();
  const changeAddress = await wallet.getChangeAddress();
  const txBuilder = getTxBuilder(); // centralized builder

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
