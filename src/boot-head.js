window.__ModuleLoader__.load({
	id: "dsh-liquid-glass-input",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		function liqIsZh() {
			var tag = ''
			try { if (document.documentElement && document.documentElement.lang) tag = document.documentElement.lang } catch (e) {}
			if (!tag) {
				try { tag = (navigator && (navigator.language || (navigator.languages && navigator.languages[0]))) || '' } catch (e) {}
			}
			return String(tag).toLowerCase().indexOf('zh') === 0
		}
		function liqT(zh, en) { return liqIsZh() ? zh : en }
		try { console.info('[liq] dsh-liquid-glass-input v1.32.9') } catch (e) {}
		var LG_API = '/api/liquid-glass-input/settings'
		var LIQ_PREFIX = 'dsh-liquid-glass-input.'
		var LIQ_KEYS = { stretchon:1,stretchk:1,strsens:1,strmax:1,strrate:1,animon:1,presschrome:1,speed:1,amplitude:1,blur:1,bluron:1,saton:1,satval:1,lsmagon:1,lsmagk:1,lsrefon:1,lsrefk:1,lsspeon:1,lsspecmul:1,acrylicmode:1,tint:1,tinton:1,cw:1,ch:1,chmode:1,sidebtn:1,nudge:1,inset:1,rowinset:1,rowy:1,fadetop:1,fadebot:1,highlight:1,hlsat:1,hlbri:1,hlsize:1,hlsoft:1,fpsdbg:1 }
		function liqAllowed(k) {
			return !!(k && k.indexOf(LIQ_PREFIX) === 0 && LIQ_KEYS[k.slice(LIQ_PREFIX.length)])
		}
		function liqPick(obj) {
			var out = {}
			if (!obj) return out
			for (var k in obj) if (liqAllowed(k) && obj[k] != null) out[k] = String(obj[k])
			return out
		}
		var liqRemote = null
		var liqPushTimer = 0
		function liqPushRemote(snapshot) {
			try {
				fetch(LG_API, {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify(liqPick(snapshot))
				}).catch(function () {})
			} catch (e) {}
		}
		function liqSeedLocal() {
			if (liqRemote && typeof liqRemote === 'object') return
			var seeded = {}
			try {
				for (var i = 0; i < localStorage.length; i++) {
					var k = localStorage.key(i)
					if (liqAllowed(k)) seeded[k] = localStorage.getItem(k)
				}
			} catch (e) {}
			liqRemote = seeded
		}
		function liqFetchRemote() { liqSeedLocal() }
		function liqFetchRemoteAsync() {
			try {
				fetch(LG_API, { headers: { accept: 'application/json' } }).then(function (r) {
					return r && r.ok ? r.json() : null
				}).then(function (data) {
					if (!data || !data.ok || !data.settings) return
					var clean = liqPick(data.settings)
					liqSeedLocal()
					var changed = false
					for (var ck in clean) {
						if (!liqRemote || liqRemote[ck] !== clean[ck]) changed = true
						liqRemote[ck] = clean[ck]
						try { localStorage.setItem(ck, clean[ck]) } catch (e) {}
					}
					for (var rk in liqRemote) {
						if (!liqAllowed(rk)) { delete liqRemote[rk]; changed = true }
					}
					if (changed) {
						try { if (typeof liqHydrate === 'function') liqHydrate() } catch (e) {}
					}
				}).catch(function () {})
			} catch (e) {}
		}
		var liqStore = {
			get: function (key) {
				liqFetchRemote()
				if (liqRemote && Object.prototype.hasOwnProperty.call(liqRemote, key)) {
					var v = liqRemote[key]
					return v === null || v === undefined ? null : String(v)
				}
				try { return localStorage.getItem(key) } catch (e) { return null }
			},
			set: function (key, value) {
				if (!liqAllowed(key)) return
				try { localStorage.setItem(key, value) } catch (e) {}
				liqFetchRemote()
				if (!liqRemote || typeof liqRemote !== 'object') liqRemote = {}
				liqRemote[key] = String(value)
				if (liqPushTimer) clearTimeout(liqPushTimer)
				liqPushTimer = setTimeout(function () {
					liqPushTimer = 0
					liqPushRemote(liqRemote)
				}, 300)
			}
		}

