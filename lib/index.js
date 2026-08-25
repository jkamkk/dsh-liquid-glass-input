// Host half of dsh-liquid-glass-input.
// All rendering happens in the browser client half (lib/client.js); the
// displacement/specular/magnifying maps are embedded there, so the host
// instance is intentionally a no-op row holder.
const name = 'ui-liquid-glass'

async function apply() {}

export { apply, name }
