import fs from "fs/promises";
import path from "path";

export async function getNativeScriptFromFile(
  keyHash: string,
  slot: string | number
) {
  const filePath = path.resolve(process.cwd(), "nativeScript.json");
  const raw = await fs.readFile(filePath, "utf-8");
  const nativeScript = JSON.parse(raw);

  if (nativeScript.scripts && Array.isArray(nativeScript.scripts)) {
    nativeScript.scripts = nativeScript.scripts.map((script: any) => {
      if (script.type === "sig" && script.keyHash === "YOUR_KEY_HASH_HERE") {
        return { ...script, keyHash };
      }
      if (script.type === "after") {
        return { ...script, slot: slot.toString() };
      }
      return script;
    });
  }

  return nativeScript;
}
