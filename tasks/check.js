import Book from '@xrplkit/book'
import { div, gt, mul } from '@xrplkit/xfl/string'
import { socket, wallet, submit } from '../lib.js'


export default async function({ currency, issuer }){
	let book = new Book({
		socket,
		takerPays: { currency: 'XRP' },
		takerGets: { currency, issuer },
	})

	await book.load()

	let [ offer, nextOffer ] = book.offers

	if(!offer.priceFunded){
		console.log(`highest offer is fully funded - all good`)
		return
	}

	if(gt(offer.priceFunded, mul(offer.price, '0.97'))){
		console.log(`highest offer's funded rate is within 3% of initial rate - all good`)
		return
	}

	if(gt(mul(offer.takerPaysFunded.value, '1000000'), '100')){
		console.log(`highest offer's funded exceeds 100 drops - all good`)
		return
	}

	if(offer.account === wallet.address){
		console.log(`wedged offer is yours, cannot test, use different wallet`)
		return
	}

	console.log(`highest offer funded rate deviates significantly from initial rate!`)
	console.log(`offer id: ${offer.index}`)
	
	return { offer, nextOffer }
}