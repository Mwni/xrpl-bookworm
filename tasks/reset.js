import Account from '@xrplkit/account'
import { socket, wallet, submit } from '../lib.js'

export default async function(){
	let account = new Account({ socket, address: wallet.address })

	await account.loadLines()
	await account.loadOffers()

	if(account.lines.length === 0 && account.offers.length === 0){
		console.log(`account has no tokens or offers`)
		return
	}

	console.log(`this will market sell all currently held tokens and cancel all offers!`)
	console.log(`press [enter] to continue`)

	await new Promise(resolve => {
		process.stdin.on('data', data => data.toString().charCodeAt(0) === 13 ? resolve() : null)
	})

	for(let line of account.lines){
		console.log(`selling ${line.balance} x ${line.currency} ...`)

		await submit({
			TransactionType: 'OfferCreate',
			Account: wallet.address,
			TakerGets: {
				currency: line.currency,
				issuer: line.account,
				value: line.balance
			},
			TakerPays: '1',
			Flags: 0x00040000 | 0x00080000
		})
	}

	for(let offer of account.offers){
		console.log(`cancelling offer ${offer.seq} ...`)

		await submit({
			TransactionType: 'OfferCancel',
			Account: wallet.address,
			OfferSequence: offer.seq
		})
	}

	console.log(`reset complete`)
}