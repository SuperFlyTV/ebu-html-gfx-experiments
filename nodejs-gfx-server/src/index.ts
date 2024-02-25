import { setupServer } from './server'

console.log('Initializing...')

setupServer({
	port: 5271,
	templatesDirectory: 'templates',
})
