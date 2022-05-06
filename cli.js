import { init } from './xrpl.js'
import cripple from './cripple.js'
import * as config from './config.js'

await init({
	...config, 
	token: {
		currency: '785368726F6F6D00000000000000000000000000',
		issuer: 'rHqLei9xJch13JioYHsDUwWJoz81QQh6LU'
	}
})

switch(process.argv[2]){
	case 'cripple': 
		await cripple(config)
		break

	default:
		console.log(`specify command: (cripple|fix|undo)`)
}