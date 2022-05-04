import xrpl from 'xrpl'
import XFL from '@xrplworks/xfl'
import { fromRippled } from '@xrplworks/amount'

const spendableDrops = 100000
const targetDrops = 1.17

const seeds = [
	'sEdSRyAomwoo2VbQP6SeySBuT44Udsj',
	'sEdV2gu1jQkYuPuNMq2EPFYq7hEYWga'
]

const targetBook = {
	currency: '785368726F6F6D00000000000000000000000000',
	issuer: 'rHqLei9xJch13JioYHsDUwWJoz81QQh6LU'
}

const wallets = seeds.map(seed => xrpl.Wallet.fromSeed(seed))

console.log(`using wallets:`)
wallets.forEach(wallet => console.log(` - ${wallet.classicAddress}`))
console.log(`targeting book:`)
console.log(`  currency: ${targetBook.currency}`)
console.log(`  issuer: ${targetBook.issuer}`)
console.log(``)

const client = new xrpl.Client('wss://xrplcluster.com')

console.log('connecting to the XRPL...')
await client.connect()
console.log('connected')


async function prepare(){
	await acquireFunds()
}

async function getBalance(address){
	let balances = await client.getBalances(address)
	let balance = balances.find(balance => balance.currency === targetBook.currency 
		&& balance.issuer === targetBook.issuer)

	return balance
		? balance.value
		: '0'
}

async function acquireFunds(){
	console.log('checking balance...')
	
	let balanceA = await getBalance(wallets[0].classicAddress)
	let balanceB = await getBalance(wallets[1].classicAddress)

	console.log(`account A has ${balanceA}`)
	console.log(`account B has ${balanceB}`)

	
	let price = await getPrice()
	let requiredBalance = XFL.div(price, spendableDrops).div('1_000_000')
	let missingBalance = requiredBalance
		.minus(balanceA)
		.minus(balanceB)

	console.log(`required balance: ${requiredBalance}`)

	if(missingBalance.gt(0)){
		console.log(`buying missing ${missingBalance}`)

		let response = await client.submitAndWait(
			{
				TransactionType: 'OfferCreate',
				Account: wallets[0].classicAddress+'x',
				TakerGets: spendableDrops.toString(),
				TakerPays: {
					...targetBook,
					value: '0.00000000000001'
				},
				Flags: 0x00040000 | 0x00080000
			},
			{
				wallet: wallets[0],
				autofill: true
			}
		)

		console.log(response)
	}
}

async function getPrice(){
	let { result } = await client.request({
		command: 'book_offers',
		taker_gets: targetBook,
		taker_pays: {currency: 'XRP'},
		limit: 1
	})

	if(result.offers.length === 0)
		throw 'book is empty'
	
	let bestOffer = result.offers[0]
	let takerPays = fromRippled(bestOffer.TakerPays)
	let takerGets = fromRippled(bestOffer.TakerGets)

	return XFL.div(takerGets.value, takerPays.value)
}

async function setTrustline(enable){

}

async function cripple(){
	
	let targetPrice = counterPrice.times('1.01')
	let offerPay = XFL.div(spendableDrops, targetPrice).div('1_000_000')
	let offerGet = XFL.div(spendableDrops, '1_000_000')
	let targetPay = XFL.div(targetDrops, spendableDrops)
						.times(offerPay)

	targetPay = new XFL(new XFL(targetPay.toString()).toNative())

	let resultingDrops = targetPay.times(targetPrice).times('1_000_000')
	

	console.log(offerPay, offerGet, targetPay, resultingDrops)


}

await prepare()