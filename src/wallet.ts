import { BlockfrostProvider, MeshWallet } from "@meshsdk/core";
import { config } from "./config";

const provider = new BlockfrostProvider(config.BLOCKFROST_API_KEY);

export const wallet = new MeshWallet({
  networkId: 0, // 0 for testnet
  fetcher: provider,
  submitter: provider,
  key: {
    type: "mnemonic",
    words: config.MNEMONIC.trim().split(" "),
  },
});

export async function initWallet() {
  await wallet.init();
  const address = await wallet.getChangeAddress();
  console.log("Your wallet address is:", address);
}

initWallet();
