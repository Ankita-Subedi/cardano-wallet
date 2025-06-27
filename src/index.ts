import readline from "readline";
import { initWallet, wallet } from "./wallet";
import { showAllAddresses } from "./showAllAddresses";
import { logBalance, logUtxos } from "./utils";
import { sendValue } from "./sendAda";

// Helper function to check if string is a valid hex string
function isHexString(str: string) {
  return /^[0-9a-fA-F]+$/.test(str);
}

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
    console.log("5. Mint a Token\n");
    console.log("6. Exit\n");

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

              const assets: { unit: string; quantity: string }[] = [];

              function askTokens() {
                rl.question(
                  "Do you want to add a token to send? (yes/no): ",
                  (answer) => {
                    const ans = answer.trim().toLowerCase();

                    if (ans === "yes" || ans === "y") {
                      rl.question(
                        "Enter token unit (policyId + assetName): ",
                        (unit) => {
                          const trimmedUnit = unit.trim();

                          if (!trimmedUnit) {
                            console.log("Token unit cannot be empty.");
                            askTokens();
                            return;
                          }

                          if (!isHexString(trimmedUnit)) {
                            console.log(
                              "❗ Token unit must be a valid hex string (0-9, a-f)."
                            );
                            askTokens();
                            return;
                          }

                          rl.question("Enter token quantity: ", (qty) => {
                            if (
                              !qty.trim() ||
                              isNaN(Number(qty)) ||
                              Number(qty) <= 0
                            ) {
                              console.log(
                                "Please enter a valid positive quantity."
                              );
                              askTokens();
                              return;
                            }

                            assets.push({
                              unit: trimmedUnit,
                              quantity: qty.trim(),
                            });
                            console.log("Token added.");
                            askTokens(); // ask again for next token
                          });
                        }
                      );
                    } else if (ans === "no" || ans === "n") {
                      if (
                        assets.length === 0 ||
                        assets.every((a) => Number(a.quantity) <= 0)
                      ) {
                        console.log(
                          "You must enter at least some ADA or tokens to send."
                        );
                        showMenu();
                        return;
                      }

                      sendValue(recipient.trim(), assets)
                        .then(() => showMenu())
                        .catch((err) => {
                          console.error("❌ Failed to send");
                          console.error(
                            "🔍 Error message:",
                            err.message || err
                          );
                          showMenu();
                        });
                    } else {
                      console.log("Please answer 'yes' or 'no'.");
                      askTokens();
                    }
                  }
                );
              }

              rl.question(
                "Do you want to send ADA? (yes/no): ",
                (adaAnswer) => {
                  const adaAns = adaAnswer.trim().toLowerCase();

                  if (adaAns === "yes" || adaAns === "y") {
                    rl.question("Enter ADA amount in lovelace: ", (amount) => {
                      const trimmedAmount = amount.trim();
                      if (
                        !trimmedAmount ||
                        isNaN(Number(trimmedAmount)) ||
                        Number(trimmedAmount) <= 0
                      ) {
                        console.log(
                          "Please enter a valid positive ADA amount."
                        );
                        showMenu();
                        return;
                      }

                      assets.push({
                        unit: "lovelace",
                        quantity: trimmedAmount,
                      });
                      askTokens();
                    });
                  } else if (adaAns === "no" || adaAns === "n") {
                    askTokens();
                  } else {
                    console.log("Please answer 'yes' or 'no'.");
                    showMenu();
                  }
                }
              );
            });
            return;
          }
          case "5": {
            try {
              const { mintDemoToken } = await import("./mint");
              await mintDemoToken();
            } catch (err) {
              console.error("❌ Minting failed:", err);
            }
            break;
          }

          case "6":
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
