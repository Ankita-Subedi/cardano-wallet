import { BlockfrostProvider, MeshWallet } from "@meshsdk/core";
import { config } from "./config";
import { provider } from "./provider";

export const wallet = new MeshWallet({
  networkId: 0,
  fetcher: provider,
  submitter: provider,
  key: {
    type: "mnemonic",
    words: config.MNEMONIC.trim().split(" "),
  },
});

export async function initWallet() {
  await wallet.init();
}
