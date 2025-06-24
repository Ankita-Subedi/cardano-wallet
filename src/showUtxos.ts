import { wallet } from './wallet';

async function showUtxos() {
  const utxos = await wallet.getUtxos();

  console.log(" Your UTXOs:");
  utxos.forEach((utxo, index) => {
    console.log(`\nUTXO #${index + 1}`);
    console.log(`- Tx Hash: ${utxo.input.txHash}`);
    console.log(`- Output Index: ${utxo.input.outputIndex}`);
    console.log(`- Address: ${utxo.output.address}`);
    utxo.output.amount.forEach(asset => {
      console.log( ` - Asset: ${asset.unit}, Quantity: ${asset.quantity}`);
    });
  });
}

showUtxos();
