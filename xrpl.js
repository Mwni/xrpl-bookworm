import Book from '@xrplworks/book'
import XFL from '@xrplworks/xfl'
import xrpl from 'xrpl'

let client
let socket
let token
let wallets

export async function init({ node, token: t, walletSeeds }){
	process.stdout.write(`initializing XRPL connection... `)

	client = new xrpl.Client(node)
	token = t

	wallets = walletSeeds
		.map(seed => xrpl.Wallet.fromSeed(seed))

	await client.connect()

	console.log(`done`)
}

export async function getTokenPrices(){
	let askBook = new Book({

	})
	let { buy, sell } = await client.getOrderbook(
		{ currency: 'XRP' },
		token
	)

	let calc = ({ TakerGets, TakerPays }) => {
		let takerGets = 
	}
}

export async function getTokenBalance({ walletIndex }){
	let balances = await client.getBalances(wallets[walletIndex], {peer: token.issuer})
	let balance = balances.find(balance => balance.currency === token.currency)

	return balance
		? balance.value
		: '0'
}

export async function transferToken(){

}

export async function createOffer(){

}