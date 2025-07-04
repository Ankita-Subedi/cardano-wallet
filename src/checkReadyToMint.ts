import { readSavedSlot, getCurrentSlot } from "./utils";

async function checkReadyToMint() {
  const savedSlot = await readSavedSlot();
  const currentSlot = await getCurrentSlot();

  console.log("⏳ Current Slot:", currentSlot);
  console.log("🔐 Saved Future Slot:", savedSlot);

  if (currentSlot >= savedSlot) {
    console.log("✅ Ready to mint! Run mintWithNativeScript.ts");
  } else {
    console.log("🚫 Not yet. Please wait a few more minutes...");
  }
}

checkReadyToMint();
