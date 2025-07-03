import { getWallet } from "./wallet";
import { logUtxos } from "./utils";

async function showUtxos() {
  const wallet = getWallet();
  const utxos = await wallet.getUtxos();
  logUtxos(utxos);
}

showUtxos();
