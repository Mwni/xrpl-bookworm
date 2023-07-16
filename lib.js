import Socket from '@xrplkit/socket'
import { deriveAddress } from '@xrplkit/wallet'
import { submitAndWait } from '@xrplkit/submit'
import fs from 'fs'

const { node, walletSeed, spendableDrops, cripplingDrops } = JSON.parse(
	fs.readFileSync('config.json', 'utf-8')
)

console.log(``)
console.log(`*** XRPL BOOKWORM ***`)
console.log(`using node:	${node}`)

export const socket = new Socket(node)
export const wallet = readWallet()
export { spendableDrops, cripplingDrops }

if(wallet)
	console.log(`using wallet:	${wallet.address}`)

console.log(``)

export async function submit(tx){
	process.stdout.write(`submitting [${tx.TransactionType}] ... `)

	let result = await submitAndWait({
		socket,
		tx,
		seed: wallet.seed,
		autofill: true
	})

	console.log(result.engine_result)
	return result.engine_result
}

function readWallet(){
	try{
		return { 
			address: deriveAddress({ seed: walletSeed }), 
			seed: walletSeed 
		}
	}catch{
		console.log('wallet seed in config.json is not valid')
		console.log('only the "check" command will work now')
	}
}
