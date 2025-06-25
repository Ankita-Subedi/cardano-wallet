import { MeshTxBuilder } from "@meshsdk/core";
import { provider } from "./provider";

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
    verbose: true,
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
