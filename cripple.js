import XFL from '@xrplworks/xfl'
import { getTokenBalance, getTokenBook, transferToken } from './xrpl.js'

export default async function({ cripplingXRP, spendableXRP }){
	let book = await getTokenBook()

	console.log(book)
	
	let targetPrice = XFL.mul(book.bestPrice, '1.01')
	let offerPay = XFL.div(spendableXRP, targetPrice)
	let offerGet = spendableXRP
	let cripplingPay = XFL.div(cripplingXRP, spendableXRP)
						.times(offerPay)

	//targetPay = new XFL(new XFL(targetPay.toString()).toNative())
	//let resultingDrops = targetPay.times(targetPrice).times('1_000_000')

	console.log(`required tokens: ${offerPay}`)

	let balanceB = await getTokenBalance({walletIndex: 1})

	if(balanceB !== '0'){
		await transferToken({
			sourceWalletIndex: 1, 
			destinationWalletIndex: 0,
			amount: balanceB
		})
	}

	let balanceA = await getTokenBalance({walletIndex: 0})

	if(offerPay.gt(balanceA)){
		let missingAmount = offerPay.minus(balanceA)

		console.log(`market buying ${missingAmount}...`)
	}
}