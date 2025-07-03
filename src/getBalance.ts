import { getWallet } from "./wallet";
import { logBalance } from "./utils";

async function showBalance() {
  const wallet = getWallet();
  const balance = await wallet.getBalance();
  logBalance(balance);
}

showBalance();
