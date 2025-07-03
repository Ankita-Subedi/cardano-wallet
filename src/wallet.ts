import { MeshWallet } from "@meshsdk/core";
import { provider } from "./provider";

let currentWallet: MeshWallet | null = null;

export function getWallet() {
  if (!currentWallet) {
    throw new Error("Wallet not initialized. Call initWallet() first.");
  }
  return currentWallet;
}

export async function initWallet(mnemonic: string) {
  const words = (mnemonic).trim().split(" ");

  currentWallet = new MeshWallet({
    networkId: 0,
    fetcher: provider,
    submitter: provider,
    key: {
      type: "mnemonic",
      words,
    },
  });

  await currentWallet.init();
}
