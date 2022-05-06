import xrpl from 'xrpl'
import Book from '@xrplworks/book'
import * as config from '../config.js'


export const wallets = config.walletSeeds.map(seed => xrpl.Wallet.fromSeed(seed))
export const client = new xrpl.Client(config.node)
export const targetToken = {}
export const book = new Book({
	socket: {request: async request => (await client.request(request)).result},
	takerGets: targetToken,
	takerPays: { currency: 'XRP' }
})

export async function init(){
	await client.connect()
	await book.load()
}