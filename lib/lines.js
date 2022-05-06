import { client, wallets, targetToken } from './ctx.js'

export async function setup(){
	await set(0)
	await set(1)
}

async function set(wallet){
	let address = wallets[i]

	console.log(`setting trustline to ${address}...`)

	let { result } = await client.submit(
		{
			TransactionType: 'TrustSet',
			Account: address,
			LimitAmount: {
				...targetToken,
				value: '100000000000'
			},
			Flags: 0x00020000
		},
		{
			wallet: wallets[i],
			autofill: true
		}
	)

	console.log(`set trustline:`, result.engine_result)
}