import { wallet } from "./wallet";

async function showBalance() {
  const balance = await wallet.getBalance();
  console.log("Your wallet balance:");
  balance.forEach((asset) => {
    console.log(`- Asset: ${asset.unit}, Quantity: ${asset.quantity}`);
  });
}

showBalance();
