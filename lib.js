import Socket from '@xrplkit/socket'
import { deriveAddress } from '@xrplkit/wallet'
import fs from 'fs'

const { node, walletSeed, spendableXRP, cripplingXRP } = JSON.parse(
	fs.readFileSync('config.json', 'utf-8')
)

export const socket = new Socket(node)
export const wallet = { address: deriveAddress({ seed: walletSeed }), seed: walletSeed }
export { spendableXRP, cripplingXRP }

export function submit(tx){
	process.stdout.write(`submitting ${submission.tx.TransactionType} to the XRPL...`)
	console.log(`done`)
}

console.log(``)
console.log(`*** XRPL BOOKWORM ***`)
console.log(`using node:	${node}`)
console.log(`using wallet:	${wallet.address}`)
console.log(``)