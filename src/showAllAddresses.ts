import { wallet } from "./wallet";
import { logAddresses } from "./utils";

export async function showAllAddresses() {
  try {
    const used = await wallet.getUsedAddresses();
    const unused = await wallet.getUnusedAddresses();
    const change = await wallet.getChangeAddress();

    logAddresses(used, unused, change);
  } catch (error) {
    console.error("Failed to fetch addresses:", error);
  }
}
