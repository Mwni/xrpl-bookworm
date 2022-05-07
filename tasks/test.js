import Book from '@xrplkit/book'
import { div, gt, mul } from '@xrplkit/xfl/string'
import { socket, wallet, submit } from '../lib.js'
import check from './check.js'


export default async function({ currency, issuer }){
	let offers = await check({currency, issuer})

	if(!offers)
		return

	let { nextOffer } = offers

	console.log(`starting testing series`)

	for(let i=0; i<20; i++){
		console.log(`trying to buy ${i * 10}% above market price ...`)

		let drops = '100'
		let price = mul(nextOffer.price, 1 + i * 0.1)
		let units = div(div(drops, '1000000'), price)
		let result = await submit({
			TransactionType: 'OfferCreate',
			Account: wallet.address,
			TakerPays: {
				currency,
				issuer,
				value: units
			},
			TakerGets: drops,
			Flags: 0x00040000 | 0x00080000
		})

		if(result === 'tesSUCCESS'){
			console.log(`unwedged offer book at +${i * 10}% above market price`)
			return
		}
	}
}