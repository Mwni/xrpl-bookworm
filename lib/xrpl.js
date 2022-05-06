

export async function setTrustline({ wallet, token, active }){
	console.log(`adding trustline to ${wallet.address}`)

	await submit({
		tx: {
			TransactionType: 'TrustSet',
			Account: wallet.address,
			LimitAmount: {
				...token,
				value: active ? '100000000000' : '0'
			},
			Flags: active ? 0x00020000 : 0x00040000
		},
		seed: wallet.seed
	})
}

export async function transferToken(){

}

export async function createOffer(){

}

