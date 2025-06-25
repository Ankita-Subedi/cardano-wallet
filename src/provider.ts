import { BlockfrostProvider } from "@meshsdk/core";
import { config } from "./config";

export const provider = new BlockfrostProvider(config.BLOCKFROST_API_KEY);
