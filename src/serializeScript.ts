import {
  serializeNativeScript,
  NativeScript,
  deserializeAddress,
} from "@meshsdk/core";
import { getWalletAddress, buildTimeSigScript } from "./utils";

async function main() {
  try {
    const address = await getWalletAddress();

    const { pubKeyHash: keyHash } = deserializeAddress(address);

    const nativeScript: NativeScript = buildTimeSigScript(keyHash);

    const result = serializeNativeScript(nativeScript);

    console.log(" Native Script Address (Bech32):", result.address);
    console.log(" Script CBOR Hex:", result.scriptCbor);
  } catch (err) {
    console.error(" Failed to serialize script:", err);
  }
}

main();
