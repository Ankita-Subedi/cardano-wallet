import { deserializeAddress, resolveNativeScriptHash } from "@meshsdk/core";
import { getWalletAddress, buildTimeSigScript } from "./utils";

async function main() {
  const address = await getWalletAddress();
  const { pubKeyHash: keyHash } = deserializeAddress(address);

  const nativeScript = buildTimeSigScript(keyHash);

  const hash = resolveNativeScriptHash(nativeScript);

  console.log("🔑 Native Script Hash:", hash);
}

main().catch((err) => {
  console.error(" Error resolving script hash:", err);
});
