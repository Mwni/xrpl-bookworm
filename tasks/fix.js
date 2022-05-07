import Book from '@xrplkit/book'
import { div, gt, mul } from '@xrplkit/xfl/string'
import { socket, wallet, submit } from '../lib.js'
import check from './check.js'


export default async function({ currency, issuer }){
	while(true){
		let offers = await check({currency, issuer})

		if(!offers)
			return

		let { nextOffer } = offers

		console.log(`fixing book (this may cost up to 100 drops) ...`)

		let result = await submit({
			TransactionType: 'OfferCreate',
			Account: wallet.address,
			TakerPays: {
				currency,
				issuer,
				value: '0.00000000000000001'
			},
			TakerGets: '100',
			Flags: 0x00040000 | 0x00080000
		})

		if(result === 'tesSUCCESS'){
			console.log(`fixed offer book successfully`)
			return
		}
	}
}