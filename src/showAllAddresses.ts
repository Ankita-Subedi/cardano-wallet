import { wallet } from "./wallet";

async function showAllAddresses() {
  const used = await wallet.getUsedAddresses();
  const unused = await wallet.getUnusedAddresses();

  console.log("Used addresses:");
  used.forEach((addr) => console.log(addr));

  console.log("\nUnused addresses:");
  unused.forEach((addr) => console.log(addr));
}

showAllAddresses();
