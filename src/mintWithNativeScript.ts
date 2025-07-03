import {
  MeshTxBuilder,
  stringToHex,
} from "@meshsdk/core";
import { wallet } from "./wallet";
import { provider } from "./provider";
import { getForgingScript } from "./utils";

const demoAssetMetadata = {
  name: "LililiToken",
  image: "ipfs://QmRzicpReutwCkM6aotuKjErFCUD213DpwPq6ByuzMJaua",
  description: "Minted using Native Script rules lilly token",
};

async function main() {
  const utxos = await wallet.getUtxos();
  const { forgingScript, policyId, address } = await getForgingScript();

  const tokenName = "LillyToken";
  const tokenNameHex = stringToHex(tokenName);
  const metadata = {
    [policyId]: {
      [tokenName]: demoAssetMetadata,
    },
  };

  const txBuilder = new MeshTxBuilder({
    fetcher: provider,
    verbose: true,
  });

  const unsignedTx = await txBuilder
    .mint("1", policyId, tokenNameHex)
    .mintingScript(forgingScript)
    .metadataValue(721, metadata)
    .changeAddress(address)
    .invalidHereafter(99999999)
    .selectUtxosFrom(utxos)
    .complete();

  const signedTx = await wallet.signTx(unsignedTx);
  const txHash = await wallet.submitTx(signedTx);

  console.log(" Minted with native script!");
  console.log(" Transaction Hash:", txHash);
}

main().catch((err) => {
  console.error(" Failed to mint with native script:", err);
});
