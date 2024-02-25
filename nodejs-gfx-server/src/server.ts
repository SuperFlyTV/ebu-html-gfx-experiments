import * as express from 'express'
import * as ExpressWs from 'express-ws'
import { WebSocket } from 'ws'
import * as path from 'path'
import { promises as fs } from 'fs'
import { CommandSchemas } from './api'

const STATIC_DIR = path.join(__dirname, 'static')

/** Maps rendererId -> WebSocket */
const connectedRenderers = new Map<string, WebSocket[]>()

export function setupServer(config: { port: number; templatesDirectory: string }): void {
	const app = express()
	const appWs = ExpressWs(app)
	app.use(express.json())

	app.get('/', async (_, res) => {
		await serveStaticFile(res, 'index.html')
	})

	app.get(`/render/:rendererId`, async (_, res) => {
		await serveStaticFile(res, 'render.html')
	})
	app.get(`/controller`, async (_, res) => {
		await serveStaticFile(res, 'controller.html')
	})
	app.get(`/test-page`, async (_, res) => {
		await serveStaticFile(res, 'test-page.html')
	})
	app.get(`/template/:templateName`, async (req, res) => {
		await serveTemplateFile(res, config.templatesDirectory, req.params.templateName)
	})

	// Handle websocket connection to the renderer page:
	appWs.app.ws('/renderer-data-connection', (ws, _req) => {
		console.log('Websocket connected!')

		let registeredRendererId: string | null = null
		ws.on('close', () => {
			console.log('Websocket connection closed')

			// Unregister renderer websocket:
			if (registeredRendererId) {
				const r = connectedRenderers.get(registeredRendererId)
				if (r) {
					const i = r.indexOf(ws)
					if (i > -1) r.splice(i, 1)
					if (r.length === 0) connectedRenderers.delete(registeredRendererId)
				}
			}
		})

		ws.on('message', (msg) => {
			try {
				const c = JSON.parse(msg.toString())
				if (c.type === 'register') {
					registeredRendererId = `${c.rendererId}`
					let r = connectedRenderers.get(registeredRendererId)
					if (!r) {
						r = []
						connectedRenderers.set(registeredRendererId, r)
					}
					r.push(ws)

					console.log('Registered renderer:', registeredRendererId)
				}
			} catch (e) {
				console.log(msg)
				console.error(e)
			}
		})
	})

	// External API:

	// for (const key of Object.keys(CommandSchemas) as (keyof typeof CommandSchemas)[]) {
	// 	const command = CommandSchemas[key]

	// }

	app.get(`/api/:rendererId/:commandType/`, async (req, res) => {
		await handleCommand(res, 'get', req.params.rendererId, req.params.commandType, req.body)
	})
	app.post(`/api/:rendererId/:commandType/`, async (req, res) => {
		await handleCommand(res, 'post', req.params.rendererId, req.params.commandType, req.body)
	})

	app.listen(config.port)

	console.log(`Server running on port ${config.port}`)
	console.log(`Renderer: http://localhost:${config.port}/render`)
	console.log(`API:      http://localhost:${config.port}/api`)
}

async function serveStaticFile(response: express.Response, fileName: string) {
	try {
		response.send(await fs.readFile(path.join(STATIC_DIR, fileName), 'utf8'))
	} catch (e) {
		response.status(500).send(`${e}`)
	}
}
async function serveTemplateFile(response: express.Response, templatesDirectory: string, templateName: string) {
	try {
		response.send(await fs.readFile(path.join(templatesDirectory, templateName), 'utf8'))
	} catch (e) {
		response.status(500).send(`${e}`)
	}
}
async function handleCommand(
	response: express.Response,
	commandType: string,
	rendererId: string,
	commandName: string,
	params: any
) {
	const commandKey = `${commandType}-${commandName}` as keyof typeof CommandSchemas
	const command = CommandSchemas[commandKey]

	if (!command) {
		return response.status(404).send(`Command "${commandKey}" not found`)
	}
	console.log('command', commandType, commandName, params)
	let cmd: any
	try {
		cmd = command.schema.parse({
			...params,
		})
	} catch (e) {
		return response.status(400).send(`${e}`)
	}

	// Send command to renderer(s):
	for (const ws of connectedRenderers.get(rendererId) || []) {
		ws.send(
			JSON.stringify({
				command: commandKey,
				payload: cmd,
			})
		)
	}
	return response.status(200).send('OK')
}
