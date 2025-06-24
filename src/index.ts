import { initWallet } from "./wallet";

async function main() {
  try {
    await initWallet();
  } catch (error) {
    console.error(" Failed to initialize wallet:", error);
  }
}

main();
