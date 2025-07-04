import {
  MeshTxBuilder,
  NativeScript,
  deserializeAddress,
  ForgeScript,
  resolveScriptHash,
} from "@meshsdk/core";
import { provider } from "./provider";
import { getWallet } from "./wallet";
import { getNativeScriptFromFile } from "./getNativeScriptFromFile";
import fetch from "node-fetch";
import { config } from "./config";
import fs from "fs/promises";
import path from "path";

const BLOCKFROST_URL = "https://cardano-preprod.blockfrost.io/api/v0";

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
  const wallet = getWallet();
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

export async function readSavedSlot(): Promise<number> {
  const slotPath = path.resolve(process.cwd(), "slot.json");
  const raw = await fs.readFile(slotPath, "utf-8");
  const { slot } = JSON.parse(raw);
  return parseInt(slot);
}

export async function getForgingScript(): Promise<{
  forgingScript: ReturnType<typeof ForgeScript.fromNativeScript>;
  policyId: string;
  address: string;
  keyHash: string;
}> {
  const address = await getWalletAddress();
  const { pubKeyHash: keyHash } = deserializeAddress(address);
  const slot = await getSlotAfter10Minutes();
  const nativeScript = await getNativeScriptFromFile(keyHash, slot);

  const forgingScript = ForgeScript.fromNativeScript(nativeScript);
  const policyId = resolveScriptHash(forgingScript);

  return { forgingScript, policyId, address, keyHash };
}

export async function getCurrentSlot(): Promise<number> {
  const res = await fetch(`${BLOCKFROST_URL}/blocks/latest`, {
    headers: {
      project_id: config.BLOCKFROST_API_KEY,
    },
  });

  if (!res.ok) {
    throw new Error(` Failed to fetch current slot: ${res.statusText}`);
  }

  const data = (await res.json()) as { slot: number };
  return data.slot;
}

export async function getSlotAfter10Minutes(): Promise<number> {
  const currentSlot = await getCurrentSlot();
  const slotAfter10Min = currentSlot + 2000; // 2000 slots ≈ 10 min on preprod
  return slotAfter10Min;
}

export async function saveSlotAfter10Min(): Promise<void> {
  const currentSlot = await getCurrentSlot();
  const futureSlot = currentSlot + 2000; // ≈ 10 min later on preprod

  const slotPath = path.resolve(process.cwd(), "slot.json");
  await fs.writeFile(slotPath, JSON.stringify({ slot: futureSlot }, null, 2), "utf-8");

  console.log("Saved future slot:", futureSlot);
}
