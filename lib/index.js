// Host half of dsh-liquid-glass-input: persists client settings under ~/.dsh/.
import { homedir } from 'node:os'
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const name = 'ui-liquid-glass'
const inject = ['webServer']

const SETTINGS_DIR = process.env.DSH_HOME ? join(process.env.DSH_HOME, '.dsh') : join(homedir(), '.dsh')
const SETTINGS_PATH = join(SETTINGS_DIR, 'liquid-glass-input.settings.json')
const PREFIX = 'dsh-liquid-glass-input.'
const ALLOWED = new Set([
	'stretchon', 'stretchk', 'strsens', 'strmax', 'strrate',
	'animon', 'presschrome', 'speed', 'amplitude',
	'blur', 'bluron',
	'saton', 'satval',
	'lsmagon', 'lsmagk', 'lsrefon', 'lsrefk', 'lsspeon', 'lsspecmul',
	'acrylicmode', 'tint', 'tinton',
	'cw', 'ch', 'chmode',
	'sidebtn', 'nudge', 'inset', 'rowinset', 'rowy',
	'fadetop', 'fadebot',
	'highlight', 'hlsat', 'hlbri', 'hlsize', 'hlsoft',
	'fpsdbg'
])

function cleanSettings(obj) {
	const clean = {}
	if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return clean
	for (const [key, value] of Object.entries(obj)) {
		if (typeof key !== 'string' || key.indexOf(PREFIX) !== 0) continue
		if (!ALLOWED.has(key.slice(PREFIX.length))) continue
		if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') clean[key] = value
	}
	return clean
}

function readSettings() {
	try {
		if (!existsSync(SETTINGS_PATH)) return {}
		const parsed = JSON.parse(readFileSync(SETTINGS_PATH, 'utf8'))
		return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
	} catch (e) { return {} }
}

function writeSettings(obj) {
	mkdirSync(SETTINGS_DIR, { recursive: true })
	const tmp = SETTINGS_PATH + '.tmp'
	writeFileSync(tmp, JSON.stringify(obj, null, 2))
	renameSync(tmp, SETTINGS_PATH)
}

function readCleanSettings() {
	const raw = readSettings()
	const clean = cleanSettings(raw)
	if (Object.keys(raw).length !== Object.keys(clean).length) {
		try { writeSettings(clean) } catch (e) {}
	}
	return clean
}

function sameOrigin(req) {
	const origin = req.headers.origin
	if (!origin) return true
	try { return new URL(origin).host === req.headers.host } catch (e) { return false }
}

async function apply(ctx) {
	await ctx.effect(() => {
		const disposers = []
		disposers.push(ctx.webServer.register({
			kind: 'exact',
			path: '/api/liquid-glass-input/settings',
			handler: (req, res) => {
				if (req.method === 'GET') {
					res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
					res.end(JSON.stringify({ ok: true, settings: readCleanSettings() }))
					return
				}
				if (req.method === 'POST') {
					if (!sameOrigin(req)) { res.writeHead(403); res.end(); return }
					let body = ''
					req.on('data', (chunk) => { body += chunk; if (body.length > 65536) req.destroy() })
					req.on('end', () => {
						try {
							const parsed = JSON.parse(body || '{}')
							if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('bad payload')
							const clean = cleanSettings(parsed)
							writeSettings(clean)
							res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' })
							res.end(JSON.stringify({ ok: true, saved: Object.keys(clean).length }))
						} catch (e) {
							res.writeHead(400, { 'content-type': 'application/json; charset=utf-8' })
							res.end(JSON.stringify({ ok: false, error: 'bad-json' }))
						}
					})
					return
				}
				res.writeHead(405, { 'content-type': 'application/json; charset=utf-8' })
				res.end(JSON.stringify({ ok: false, error: 'method-not-allowed' }))
			}
		}))
		return () => { for (const dispose of disposers) dispose() }
	}, 'ui-liquid-glass: routes')
}

export { apply, inject, name }
