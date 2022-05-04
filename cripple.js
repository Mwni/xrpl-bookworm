import xrpl from 'xrpl'
import XFL from '@xrplworks/xfl'
import { fromRippled } from '@xrplworks/amount'

const seeds = [
	'sEdSRyAomwoo2VbQP6SeySBuT44Udsj',
	'sEdV2gu1jQkYuPuNMq2EPFYq7hEYWga'
]

const targetBook = {
	takerGets: {
		currency: '785368726F6F6D00000000000000000000000000',
		issuer: 'rHqLei9xJch13JioYHsDUwWJoz81QQh6LU'
	},
	takerPays: {
		currency: 'XRP'
	}
}

const wallets = seeds.map(seed => xrpl.Wallet.fromSeed(seed))

console.log(`using wallets:`)
wallets.forEach(wallet => console.log(` - ${wallet.classicAddress}`))
console.log(`targeting book:`)
console.log(`  takerPays: ${targetBook.takerPays.currency} ${targetBook.takerPays.issuer}`)
console.log(`  takerGets: ${targetBook.takerGets.currency} ${targetBook.takerGets.issuer}`)
console.log(``)

const client = new xrpl.Client('wss://xrplcluster.com')

console.log('connecting to the XRPL...')
await client.connect()
console.log('connected')


async function cripple(){
	let { result } = await client.request({
		command: 'book_offers',
		taker_gets: targetBook.takerPays,
		taker_pays: targetBook.takerGets,
		limit: 1
	})

	if(result.offers.length === 0)
		throw 'book is empty'
	
	let bestOffer = result.offers[0]
	let takerPays = fromRippled(bestOffer.TakerPays)
	let takerGets = fromRippled(bestOffer.TakerGets)
	let counterPrice = XFL.div(takerGets.value, takerPays.value)
	let targetPrice = counterPrice.times('1.01')

	console.log(targetPrice)
}


await cripple()