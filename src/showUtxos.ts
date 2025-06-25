import { wallet } from "./wallet";
import { logUtxos } from "./utils";

async function showUtxos() {
  const utxos = await wallet.getUtxos();
  logUtxos(utxos);
}

showUtxos();
