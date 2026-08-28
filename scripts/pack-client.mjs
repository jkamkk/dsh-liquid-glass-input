// Rebuild lib/client.js from src/. Edit maps / core / settings there, then:
//   node scripts/pack-client.mjs
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const names = ['boot-head.js', 'maps.js', 'core.js', 'settings.js', 'boot-tail.js']
const body = names.map((n) => readFileSync(join(root, 'src', n), 'utf8')).join('')
writeFileSync(join(root, 'lib', 'client.js'), body)
console.log('packed lib/client.js', body.length, 'bytes')
