import Account from '@xrplkit/account'
import Book from '@xrplkit/book'
import { lt, sub } from '@xrplkit/xfl'
import { mul, div } from '@xrplkit/xfl/string'
import { socket, spendableXRP, cripplingXRP, wallet, submit } from '../lib.js'


export default async function({ currency, issuer }){
	console.log(`blocking book ${currency}:${issuer}`)

	let account = new Account({ socket, address: wallet.address })
	let book = new Book({
		socket,
		takerGets: { currency: 'XRP' },
		takerPays: { currency, issuer}
	})

	console.log(`loading book & account...`)

	await book.load()
	await account.loadLines()
	
	let targetPrice = div('1.01', book.bestPrice)
	let offerPay = div(spendableXRP, targetPrice)
	let offerGet = spendableXRP
	let cripplingPay = mul(div(cripplingXRP, spendableXRP), offerPay)
	let balance = account.balanceOf({ currency, issuer }) || '0'
	let missingAmount = sub(offerPay, balance)

	console.log(`required tokens: ${offerPay}`)
	console.log(`balance: ${balance}`)

	if(gt(missingAmount, 0)){
		console.log(`market buying missing ${missingAmount}...`)

		await submit({
			TransactionType: 'OfferCreate',
			Account: wallet.address,
			TakerGets: mul(spendableXRP, '2000000'),
			TakerPays: {
				currency,
				issuer,
				value: missingAmount
			},
			Flags: 0x00040000 | 0x00080000
		})
	}
}