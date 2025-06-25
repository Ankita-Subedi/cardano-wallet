import { wallet } from "./wallet";
import { logBalance } from "./utils";

async function showBalance() {
  const balance = await wallet.getBalance();
  logBalance(balance);
}

showBalance();
