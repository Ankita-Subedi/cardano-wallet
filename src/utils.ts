import {
  MeshTxBuilder,
  NativeScript,
  deserializeAddress,
  ForgeScript,
  resolveScriptHash,
} from "@meshsdk/core";
import { provider } from "./provider";
import { wallet } from "./wallet";
import { getNativeScriptFromFile } from "./getNativeScriptFromFile";

interface Asset {
  unit: string;
  quantity: string;
}

interface UTxO {
  input: {
    txHash: string;
    outputIndex: number;
  };
  output: {
    address: string;
    amount: Asset[];
  };
}

export function getTxBuilder(): MeshTxBuilder {
  return new MeshTxBuilder({
    fetcher: provider,
    verbose: false,
  });
}

export function logBalance(balance: Asset[]): void {
  console.log("Your wallet balance:");
  balance.forEach((asset) => {
    console.log(`- Asset: ${asset.unit}, Quantity: ${asset.quantity}`);
  });
}

export function logUtxos(utxos: UTxO[]): void {
  console.log("Your UTXOs:");
  utxos.forEach((utxo, index) => {
    console.log(`\nUTXO #${index + 1}`);
    console.log(`- Tx Hash: ${utxo.input.txHash}`);
    console.log(`- Output Index: ${utxo.input.outputIndex}`);
    console.log(`- Address: ${utxo.output.address}`);
    utxo.output.amount.forEach((asset) => {
      console.log(` - Asset: ${asset.unit}, Quantity: ${asset.quantity}`);
    });
  });
}

export function logAddresses(
  used: string[],
  unused: string[],
  change: string
): void {
  console.log("Used addresses:");
  used.forEach((addr) => console.log(addr));

  console.log("\nUnused addresses:");
  unused.forEach((addr) => console.log(addr));

  console.log("\n Change Address:", change);
}

export async function getWalletAddress(): Promise<string> {
  const used = await wallet.getUsedAddresses();
  const unused = await wallet.getUnusedAddresses();
  const change = await wallet.getChangeAddress();

  const address = used[0] || unused[0] || change;

  if (!address) {
    throw new Error("No wallet address found from wallet instance");
  }

  return address;
}

export function buildTimeSigScript(keyHash: string): NativeScript {
  return {
    type: "all",
    scripts: [
      {
        type: "before",
        slot: "99999999",
      },
      {
        type: "sig",
        keyHash,
      },
    ],
  };
}

export async function getForgingScript(): Promise<{
  forgingScript: ReturnType<typeof ForgeScript.fromNativeScript>;
  policyId: string;
  address: string;
  keyHash: string;
}> {
  const address = await getWalletAddress();
  const { pubKeyHash: keyHash } = deserializeAddress(address);

  // Get JSON native script from file
  const nativeScript = await getNativeScriptFromFile(keyHash);

  // Replace the keyHash placeholder if present
  const replacedScript = JSON.parse(
    JSON.stringify(nativeScript),
    (key, value) => {
      if (typeof value === "string" && value === "YOUR_KEY_HASH_HERE") {
        return keyHash;
      }
      return value;
    }
  );

  const forgingScript = ForgeScript.fromNativeScript(replacedScript);
  const policyId = resolveScriptHash(forgingScript);

  return { forgingScript, policyId, address, keyHash };
}
