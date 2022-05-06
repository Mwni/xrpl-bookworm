import XFL from '@xrplworks/xfl'
import { compare as isSameCurrency } from '@xrplworks/currency'
import { client, book, wallets, targetToken } from './ctx.js'
import { spendableXRP } from '../config.js'

export async function acquire(){
	let { takerGets: requiredBalance } = book.fill({ takerPays: spendableXRP })
	let balanceB = await getBalance(wallets[1].classicAddress)

	console.log(`required balance: ${requiredBalance}`)

	if(balanceB !== '0'){
		await transfer(1, 0, balanceB)
	}

	let balanceA = await getBalance(wallets[0].classicAddress)

	console.log(`funds: ${balanceA}`)

	if(balanceA === '0'){
		await buy(wallets[0].classicAddress)
	}
}

export async function discard(){
	console.log(`discarding funds...`)

	let balanceA = await getBalance(wallets[0].classicAddress)
	let balanceB = await getBalance(wallets[1].classicAddress)

	if(balanceA !== '0')
		await sell(wallets[0].classicAddress, balanceA)

	if(balanceB !== '0')
		await sell(wallets[1].classicAddress, balanceB)
}

export async function transfer(a, b, value){
	console.log(`transferring funds...`)

	let { result } = await client.submit(
		{
			TransactionType: 'Payment',
			Account: wallets[a].classicAddress,
			Destination: wallets[b].classicAddress,
			Amount: {
				...targetToken,
				value
			}
		},
		{
			wallet: wallets[a],
			autofill: true
		}
	)

	console.log(`transfer funds:`, result.engine_result)
}

async function getBalance(address){
	let balances = await client.getBalances(address)
	let balance = balances.find(balance => isSameCurrency(balance, targetToken))

	return balance
		? balance.value
		: '0'
}

async function createOffer(address, takerGets, takerPays){

}

async function buy(address){
	let { result } = await client.submit(
		{
			TransactionType: 'OfferCreate',
			Account: address,
			TakerGets: XFL.mul(spendableXRP, '1_000_000').toString(),
			TakerPays: {
				...targetToken,
				value: '0.00000000000001'
			},
			Flags: 0x00040000 | 0x00080000
		},
		{
			wallet: wallets[0],
			autofill: true
		}
	)

	console.log(`buy funds: ${result.TransactionResult}`)
}

async function sell(address, value){
	let { meta } = await client.submit(
		{
			TransactionType: 'OfferCreate',
			Account: address,
			TakerPays: '1',
			TakerGets: {
				...targetToken,
				value
			},
			Flags: 0x00040000 | 0x00080000
		},
		{
			wallet: wallets[0],
			autofill: true
		}
	)

	console.log(`sell funds: ${meta.TransactionResult}`)
}