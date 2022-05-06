import block from './tasks/block.js'

const [command, arg1] = process.argv.slice(2)

switch(command){
	case 'block': 
		if(!arg1){
			console.error(`please specify token in format CURRENCY:ISSUER`)
			process.exit(1)
		}

		let [currency, issuer] = arg1.split(':')

		await block({currency, issuer})
		break

	default:
		console.log(`specify command: (block|fix|undo)`)
		process.exit(0)
}