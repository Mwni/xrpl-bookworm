import block from './tasks/block.js'
import check from './tasks/check.js'
import fix from './tasks/fix.js'
import test from './tasks/test.js'
import reset from './tasks/reset.js'

let [command, arg1] = process.argv.slice(2)


switch(command){
	case 'block': 
		await block(requireToken())
		break

	case 'check': 
		await check(requireToken())
		break

	case 'fix': 
		await fix(requireToken())
		break

	case 'test':
		await test(requireToken())
		break

	case 'reset':
		await reset()
		break

	default:
		console.log(`specify command: (check|test|fix|reset)`)
}

function requireToken(){
	if(!arg1){
		console.error(`please specify token in format CURRENCY:ISSUER`)
		process.exit(1)
	}

	let [currency, issuer] = arg1.split(':')

	return {currency, issuer}
}

process.exit(0)