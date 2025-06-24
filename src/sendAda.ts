import { BlockfrostProvider, MeshTxBuilder } from "@meshsdk/core";
import { wallet } from "./wallet";
import { config } from "./config";

async function sendAda() {
  const utxos = await wallet.getUtxos();
  const changeAddress = await wallet.getChangeAddress();

  const provider = new BlockfrostProvider(config.BLOCKFROST_API_KEY);
  const txBuilder = new MeshTxBuilder({
    fetcher: provider,
    verbose: true,
  });

  const unsignedTx = await txBuilder
    .txOut(
      "addr_test1qrmkr43dwvy9rh2fz254kqkhyzsjlk44edfj97ran2uvvfwa0d2nv207mfzlhqc5t3wezk0g65sjy92kfr7x9lyyhdmq43qm2y",
      [
        { unit: "lovelace", quantity: "1000000" }, // 1 ADA
      ]
    )
    .changeAddress(changeAddress)
    .selectUtxosFrom(utxos)
    .complete();

  const signedTx = await wallet.signTx(unsignedTx);
  const txHash = await wallet.submitTx(signedTx);

  console.log(" Transaction submitted!");
  console.log(" Transaction Hash:", txHash);
}

sendAda();
