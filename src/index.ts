import readline from "readline";
import { initWallet, wallet } from "./wallet";
import { showAllAddresses } from "./showAllAddresses";
import { logBalance, logUtxos } from "./utils";
import { sendValue } from "./sendAda";

async function main() {
  await initWallet();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  function showMenu() {
    console.log("\n📘 Cardano Wallet CLI");
    console.log("1. Show Balance");
    console.log("2. Show UTXOs");
    console.log("3. Show All Addresses");
    console.log("4. Send ADA / Tokens");
    console.log("5. Exit\n");

    rl.question("Enter your choice: ", async (answer) => {
      try {
        switch (answer.trim()) {
          case "1": {
            const balance = await wallet.getBalance();
            logBalance(balance);
            break;
          }
          case "2": {
            const utxos = await wallet.getUtxos();
            logUtxos(utxos);
            break;
          }
          case "3": {
            await showAllAddresses();
            break;
          }
          case "4": {
  rl.question("Enter recipient address: ", (recipient) => {
    if (!recipient.trim()) {
      console.log("Recipient cannot be empty.");
      showMenu();
      return;
    }

    rl.question("Enter amount of ADA (in lovelace): ", (amount) => {
      const trimmedAmount = amount.trim();
      if (!trimmedAmount || isNaN(Number(trimmedAmount)) || Number(trimmedAmount) <= 0) {
        console.log("Please enter a valid positive amount.");
        showMenu();
        return;
      }

      // Initialize assets array with ADA
      const assets = [{ unit: "lovelace", quantity: trimmedAmount }];

      // Function to ask about tokens
      function askForToken() {
        rl.question("Do you want to add a token to send? (yes/no): ", (answer) => {
          const ans = answer.trim().toLowerCase();

          if (ans === "yes" || ans === "y") {
            rl.question("Enter token unit (policyId + assetName): ", (unit) => {
              if (!unit.trim()) {
                console.log("Token unit cannot be empty.");
                askForToken();
                return;
              }
              rl.question("Enter token quantity: ", (qty) => {
                if (!qty.trim() || isNaN(Number(qty)) || Number(qty) <= 0) {
                  console.log("Please enter a valid positive quantity.");
                  askForToken();
                  return;
                }

                assets.push({ unit: unit.trim(), quantity: qty.trim() });
                console.log("Token added.");
                askForToken(); // Ask again for next token
              });
            });
          } else if (ans === "no" || ans === "n") {
            // Done adding tokens, call sendValue
            sendValue(recipient.trim(), assets)
              .then(() => showMenu())
              .catch((err) => {
                console.error("Failed to send:", err);
                showMenu();
              });
          } else {
            console.log("Please answer 'yes' or 'no'.");
            askForToken(); // Repeat if invalid answer
          }
        });
      }

      // Start asking about tokens
      askForToken();
    });
  });
  return; // Prevent fallthrough to showMenu immediately
}

          case "5":
            console.log("👋 Goodbye!");
            rl.close();
            return;
          default:
            console.log("Invalid choice. Try again.");
        }
      } catch (err) {
        console.error("Error:", err);
      }

      showMenu();
    });
  }

  showMenu();
}

main().catch((err) => {
  console.error("Fatal error:", err);
});
