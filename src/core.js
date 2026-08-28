		var REFRACT_BASE = 122.80891678834695

		var MAPS = {
			magnify: MAGNIFY_URL,
			displace: DISPLACE_URL,
			specular: SPECULAR_URL
		}

		function ensureCss(setDispose) {
			var tagId = "dsh-liquid-glass-input/glass.css"
			var css = [
				'html [data-composer-card][data-composer-card][data-composer-card][data-composer-card]{',
				'backdrop-filter: url(#liq-mag) !important;',
				'background: rgba(255,255,255,0.05) !important;',
				'border-radius: 9999px !important;',
				'box-shadow: 0px 4px 9px rgba(0,0,0,.16), inset 0px 2px 24px rgba(0,0,0,.2), inset 0px -2px 24px rgba(255,255,255,.2);',
				'will-change: transform;',
				'}',
				'.liq-highlight{position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:0;overflow:hidden}',
				'@property --liq-hls{syntax:\'<number>\';inherits:true;initial-value:1;}',
				'@property --liq-hlb{syntax:\'<number>\';inherits:true;initial-value:1;}',
				'.liq-hlpx{position:fixed;left:0;top:0;width:0;height:0;pointer-events:none;border-radius:9999px;',
				'overflow:hidden;will-change:transform;transition:--liq-hls .22s ease,--liq-hlb .22s ease;display:none;}',
				'.liq-hlpx.on{display:block;}',
				'.liq-hlpxi{position:absolute;left:var(--lx,50%);top:var(--ly,50%);width:calc(var(--liq-hlr,130px)*2);height:calc(var(--liq-hlr,130px)*2);',
				'margin-left:calc(var(--liq-hlr,130px)*-1);margin-top:calc(var(--liq-hlr,130px)*-1);border-radius:50%;',
				'backdrop-filter:saturate(var(--liq-hls,1)) brightness(var(--liq-hlb,1));',
				'-webkit-mask-image:radial-gradient(circle closest-side at 50% 50%,rgba(0,0,0,.96) var(--liq-hlc,40%),rgba(0,0,0,0) var(--liq-hle,96%));',
				'mask-image:radial-gradient(circle closest-side at 50% 50%,rgba(0,0,0,.96) var(--liq-hlc,40%),rgba(0,0,0,0) var(--liq-hle,96%));}',
				'html.liq-side-btns [data-composer-card] [data-liq-part="add"],',
				'html.liq-side-btns [data-composer-card] [data-liq-part="primary"]{position:absolute !important;z-index:6;}',
				'html.liq-side-btns [data-composer-card] [data-liq-part="add"]{left:18px !important;right:auto !important;top:50% !important;bottom:auto !important;transform:translateY(-50%) !important;margin:0 !important;}',
				'html.liq-side-btns [data-composer-card] [data-liq-part="primary"]{left:auto !important;right:18px !important;top:50% !important;bottom:auto !important;transform:translateY(-50%) !important;margin:0 !important;}',
				'html.liq-side-btns [data-composer-card] [data-input-scroll]{overflow:visible !important;}',
				'html.liq-side-btns [data-composer-card] [data-input-backdrop]{background:transparent !important;border:none !important;box-shadow:none !important;outline:none !important;}',
				'html.liq-side-btns [data-composer-card] textarea{outline:none !important;border:none !important;background:transparent !important;box-shadow:none !important;}',
				'html.liq-acrylic[data-liq-mode="light"] [data-composer-card][data-composer-card][data-composer-card]{background:rgba(255,255,255,var(--liq-alpha,.18)) !important;}',
				'html.liq-acrylic[data-liq-mode="dark"] [data-composer-card][data-composer-card][data-composer-card]{background:rgba(15,17,26,var(--liq-alpha,.18)) !important;}',
				'html.liq-acrylic[data-liq-mode="system"] [data-composer-card][data-composer-card][data-composer-card]{background:rgba(255,255,255,var(--liq-alpha,.18)) !important;}',
				'html.liq-acrylic[data-liq-mode="system"]:has(body[data-ds-dark-theme]) [data-composer-card][data-composer-card][data-composer-card]{background:rgba(15,17,26,var(--liq-alpha,.18)) !important;}',
				'html.liq-glass-size [data-composer-card][data-composer-card][data-composer-card]{width:var(--liq-cw,100%) !important;}',
				'html.liq-glass-size [data-composer-card][data-composer-card][data-composer-card]{box-sizing:content-box !important;}',
				'html.liq-glass-size[data-liq-h="fixed"] [data-composer-card][data-composer-card][data-composer-card],html.liq-glass-size[data-liq-h="grow"] [data-composer-card][data-composer-card][data-composer-card]{position:relative !important;display:flex !important;flex-direction:column !important;justify-content:flex-start !important;gap:0 !important;padding:0 !important;}',
				'html.liq-glass-size[data-liq-h="fixed"] [data-composer-card][data-composer-card][data-composer-card]{height:var(--liq-ch,70px) !important;}',
				'html.liq-glass-size[data-liq-h="grow"] [data-composer-card][data-composer-card][data-composer-card]{min-height:var(--liq-ch,70px) !important;}',
				'html.liq-glass-size[data-liq-h="fixed"] [data-composer-card][data-composer-card][data-composer-card] [data-input-scroll],html.liq-glass-size[data-liq-h="grow"] [data-composer-card][data-composer-card][data-composer-card] [data-input-scroll]{flex:1 1 auto !important;min-height:0 !important;overflow-y:auto !important;display:flex !important;flex-direction:column !important;scrollbar-width:none !important;' +
				'-webkit-mask-image:linear-gradient(to bottom,transparent 0,#000 var(--liq-fade-top,36px),#000 calc(100% - var(--liq-fade-bot,36px)),transparent 100%);' +
				'mask-image:linear-gradient(to bottom,transparent 0,#000 var(--liq-fade-top,36px),#000 calc(100% - var(--liq-fade-bot,36px)),transparent 100%);' +
				'-webkit-mask-size:100% 100%;mask-size:100% 100%;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;}',
				'html.liq-glass-size[data-liq-h="grow"] [data-composer-card][data-composer-card][data-composer-card] [data-input-scroll]{min-height:var(--liq-ch,70px) !important;}',
				'html.liq-glass-size[data-liq-h="fixed"] [data-composer-card][data-composer-card][data-composer-card] [data-input-scroll]::-webkit-scrollbar,html.liq-glass-size[data-liq-h="grow"] [data-composer-card][data-composer-card][data-composer-card] [data-input-scroll]::-webkit-scrollbar{display:none !important;}',
				'html.liq-glass-size[data-liq-h="fixed"] [data-composer-card][data-composer-card][data-composer-card] [data-liq-part="grow"],html.liq-glass-size[data-liq-h="grow"] [data-composer-card][data-composer-card][data-composer-card] [data-liq-part="grow"]{min-height:0 !important;flex:none !important;transform:none !important;}',
				'html.liq-glass-size[data-liq-h="fixed"] [data-composer-card][data-composer-card][data-composer-card] textarea,html.liq-glass-size[data-liq-h="grow"] [data-composer-card][data-composer-card][data-composer-card] textarea{max-height:100% !important;min-height:0 !important;}',
				'html.liq-glass-size[data-liq-h="fixed"] [data-composer-card][data-composer-card][data-composer-card] [data-liq-part="row"],html.liq-glass-size[data-liq-h="grow"] [data-composer-card][data-composer-card][data-composer-card] [data-liq-part="row"]{position:absolute !important;inset:0 !important;display:flex !important;align-items:flex-end !important;flex:none !important;z-index:5;pointer-events:none !important;background:transparent !important;height:auto !important;padding-bottom:6px !important;}',
				'html.liq-glass-size[data-liq-h="fixed"] [data-composer-card][data-composer-card][data-composer-card] [data-liq-part="row"] > *,html.liq-glass-size[data-liq-h="grow"] [data-composer-card][data-composer-card][data-composer-card] [data-liq-part="row"] > *{pointer-events:auto !important;}',
				'html.liq-glass-size[data-liq-h="fixed"] [data-composer-card][data-composer-card][data-composer-card] [data-liq-part="modes"],html.liq-glass-size[data-liq-h="fixed"] [data-composer-card][data-composer-card][data-composer-card] [data-liq-part="trailing"],html.liq-glass-size[data-liq-h="grow"] [data-composer-card][data-composer-card][data-composer-card] [data-liq-part="modes"],html.liq-glass-size[data-liq-h="grow"] [data-composer-card][data-composer-card][data-composer-card] [data-liq-part="trailing"]{margin-bottom:calc(0px - var(--liq-rowy,8px)) !important;}',
				'html.liq-side-btns [data-composer-card] [data-liq-part="row"]{padding-left:var(--liq-rowinset,0px) !important;padding-right:var(--liq-rowinset,0px) !important;}',
				'html.liq-side-btns [data-composer-card] [data-liq-part="grow"]{margin-left:var(--liq-inset,36px) !important;margin-right:var(--liq-inset,36px) !important;}',
				'.liq-tick{display:inline-flex;align-items:center;justify-content:flex-end;height:16px;line-height:16px;font-size:12px;font-variant-numeric:tabular-nums;font-feature-settings:"tnum";opacity:.75;user-select:none;pointer-events:none;overflow:visible;}',
				'.liq-tick-slot{position:relative;display:inline-block;width:1ch;height:16px;overflow:visible;}',
				'.liq-tick-ch,.liq-tick-ghost,.liq-tick-in,.liq-tick-out{display:block;width:1ch;height:16px;line-height:16px;text-align:center;}',
				'.liq-tick-static{display:inline-block;height:16px;line-height:16px;}',
				'.liq-tick-ghost{visibility:hidden;}',
				'.liq-tick-in,.liq-tick-out{position:absolute;left:0;top:0;will-change:transform,filter,opacity;}',
				'.liq-tick-out{animation:liq-tick-out .3s cubic-bezier(.22,.68,.28,1) forwards;}',
				'.liq-tick-in{animation:liq-tick-in .3s cubic-bezier(.22,.68,.28,1) both;}',
				'@keyframes liq-tick-out{0%{transform:translate3d(0,0,0);filter:blur(0);opacity:1}40%{filter:blur(2.2px);opacity:.5}100%{transform:translate3d(0,calc(var(--liq-tick-dir,1)*-.38em),0);filter:blur(2.6px);opacity:0}}',
				'@keyframes liq-tick-in{0%{transform:translate3d(0,calc(var(--liq-tick-dir,1)*.38em),0);filter:blur(2.6px);opacity:0}55%{filter:blur(1.8px);opacity:.75}100%{transform:translate3d(0,0,0);filter:blur(0);opacity:1}}',
				'@media (prefers-reduced-motion:reduce){.liq-tick-in,.liq-tick-out{animation:none}}',
				'.liq-kb{outline:none;}',
				'.liq-kb:focus-visible{outline:2px solid var(--dsw-alias-label-tertiary,#8aa0ff);outline-offset:2px;border-radius:8px;}'
			].join('\n')
			var tag = document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]")
			if (tag) {
				tag.textContent = css
				return
			}
			tag = document.createElement("style")
			tag.dataset.plugin = "dsh-liquid-glass-input"
			tag.dataset.pluginCss = tagId
			tag.textContent = css
			document.head.appendChild(tag)
			setDispose(function () { tag.remove() })
		}

		// ---- 源图预加载 ----
		var DISPLACE_IMG = null, SPECULAR_IMG = null, SW_DISP_IMG = null, SW_SPEC_IMG = null
		function preload() {
			return Promise.all([
				new Promise(function (res) { var i = new Image(); i.onload = function () { res(i) }; i.onerror = function () { res(null) }; i.src = DISPLACE_URL }),
				new Promise(function (res) { var i = new Image(); i.onload = function () { res(i) }; i.onerror = function () { res(null) }; i.src = SPECULAR_URL }),
				new Promise(function (res) { var i = new Image(); i.onload = function () { res(i) }; i.onerror = function () { res(null) }; i.src = SW_DISPLACE_URL }),
				new Promise(function (res) { var i = new Image(); i.onload = function () { res(i) }; i.onerror = function () { res(null) }; i.src = SW_SPEC_URL })
			]).then(function (r) {
				DISPLACE_IMG = r[0]
				SPECULAR_IMG = r[1]
				SW_DISP_IMG = r[2]
				SW_SPEC_IMG = r[3]
			})
		}

		// ---- Canvas 预合成：端头半胶囊 + 中段竖条平铺 ----
		var composeCache = {}
		function composeField(img, W, H) {
			if (!img) return null
			var c = document.createElement('canvas')
			c.width = W; c.height = H
			var g = c.getContext('2d')
			g.imageSmoothingEnabled = true
			g.imageSmoothingQuality = 'high'
			var iw = img.width, ih = img.height
			var capW = Math.min(W, H * iw / ih)
			var halfW = Math.min(capW / 2, W / 2)
			g.drawImage(img, 0, 0, iw / 2, ih, 0, 0, halfW, H)
			g.drawImage(img, iw / 2, 0, iw / 2, ih, W - halfW, 0, halfW, H)
			var sxp = iw * 0.4, sw = iw * 0.2
			var tileW = sw * H / ih
			for (var x = halfW; x < W - halfW; x += tileW) {
				var wpx = Math.min(tileW, W - halfW - x)
				g.drawImage(img, sxp, 0, sw, ih, x, 0, wpx, H)
			}
			return c.toDataURL('image/png')
		}

		function composeBoth(w, h) {
			var key = w + 'x' + h
			if (composeCache[key]) return composeCache[key]
			var m = { w: w, h: h, d: composeField(DISPLACE_IMG, w, h), s: composeField(SPECULAR_IMG, w, h) }
			composeCache[key] = m
			var keys = Object.keys(composeCache)
			while (keys.length > 3) delete composeCache[keys.shift()]
			return m
		}

		var probeNode = null
		var curW = 0, curH = 0
		var pushState = null
		var cardRo = null
		var roCard = null
		var measureRaf = 0
		var pollTimer = 0
		function stopCardWatch() {
			if (cardRo) { try { cardRo.disconnect() } catch (e) {} cardRo = null }
			roCard = null
			if (measureRaf) { try { cancelAnimationFrame(measureRaf) } catch (e) {} measureRaf = 0 }
			if (pollTimer) { clearInterval(pollTimer); pollTimer = 0 }
		}
		function bindCardWatch() {
			var card = null
			try { if (probeNode && probeNode.closest) card = probeNode.closest('[data-composer-card]') } catch (e) {}
			if (!card) return
			try { tryAttach(card) } catch (e) {}
			if (typeof ResizeObserver === 'undefined') return
			if (cardRo && roCard === card) return
			if (cardRo) { try { cardRo.disconnect() } catch (e) {} cardRo = null }
			roCard = card
			cardRo = new ResizeObserver(function () {
				if (measureRaf) return
				measureRaf = requestAnimationFrame(function () {
					measureRaf = 0
					try { measure(false) } catch (e) {}
				})
			})
			try { cardRo.observe(card) } catch (e) {}
		}
		function startCardWatch() {
			bindCardWatch()
			if (pollTimer) return
			pollTimer = setInterval(function () {
				try {
					if (probeNode && probeNode.closest) {
						var c = probeNode.closest('[data-composer-card]')
						if (c && c !== attachedEl) bindCardWatch()
					}
				} catch (e) {}
			}, 800)
		}

		function measure(force) {
			var w = 760, h = 116
			if (probeNode && probeNode.closest) {
				var card = probeNode.closest('[data-composer-card]')
				if (card && card.offsetWidth) {
					w = card.offsetWidth
					h = card.offsetHeight
				}
			}
			if (!force && Math.abs(w - curW) < 6 && Math.abs(h - curH) < 6) return
			if (!DISPLACE_IMG || !SPECULAR_IMG || !pushState) return
			var m = composeBoth(w, h)
			curW = m.w; curH = m.h
			pushState(m)
			try { hlVertAlign() } catch (e) {}
			try { if (hlSyncRect) hlSyncRect() } catch (e) {}
		}

		// ---- 原版 9 弹簧系统（rAF 积分）----
		// u/mag 折射与放大 {250,14}；_ 纵向基准 {340,20}；b 跟踪 {340,30}；
		// T/D/re 阴影偏移模糊 {340,30}；k/ne 阴影透明度 {220,24}
		var SPRING_EPS = 0.0004

		function mkSpr(v) { return { x: v, v: 0, t: v, k: 340, c: 20 } }
		var spU = mkSpr(.8); spU.k = 250; spU.c = 14
		var spMag = mkSpr(24); spMag.k = 250; spMag.c = 14
		var spBase = mkSpr(1); spBase.k = 340; spBase.c = 20
		var spB = mkSpr(1); spB.k = 340; spB.c = 30
		var spT = mkSpr(0); spT.k = 340; spT.c = 30
		var spD = mkSpr(4); spD.k = 340; spD.c = 30
		var spRe = mkSpr(9); spRe.k = 340; spRe.c = 30
		var spK = mkSpr(.16); spK.k = 220; spK.c = 24
		var spNe = mkSpr(.2); spNe.k = 220; spNe.c = 24
		var ALL = [spU, spMag, spBase, spB, spT, spD, spRe, spK, spNe]

		// ---- 按住拖拽拉伸 ----
		var STRON_KEY = 'dsh-liquid-glass-input.stretchon'
		var STRK_KEY = 'dsh-liquid-glass-input.stretchk'
		var STRSENS_KEY = 'dsh-liquid-glass-input.strsens'
		var STRMAX_KEY = 'dsh-liquid-glass-input.strmax'
		var STRRATE_KEY = 'dsh-liquid-glass-input.strrate'
		var stretchOn = true
		var stretchK = .06
		var strSens = .1
		var strMax = 22
		var strRate = 10
		try {
			stretchOn = liqStore.get(STRON_KEY) !== '0'
			var savedSk = parseFloat(liqStore.get(STRK_KEY))
			if (savedSk >= 0 && savedSk <= .7) stretchK = savedSk
			var savedSens = parseFloat(liqStore.get(STRSENS_KEY))
			if (savedSens >= .1 && savedSens <= .8) strSens = savedSens
			var savedMax = parseFloat(liqStore.get(STRMAX_KEY))
			if (savedMax >= 20 && savedMax <= 90) strMax = savedMax
			var savedRate = parseFloat(liqStore.get(STRRATE_KEY))
			if (savedRate >= 3 && savedRate <= 20) strRate = savedRate
		} catch (e) {}
		function setStretch(on, k) {
			stretchOn = on; stretchK = k
			try {
				liqStore.set(STRON_KEY, on ? '1' : '0')
				liqStore.set(STRK_KEY, String(k))
			} catch (e) {}
			if (!on) { strTX = 0; strTY = 0; kick() }
		}
		var strX = 0, strY = 0, strTX = 0, strTY = 0, strOx = 0, strOy = 0
		function clampLim(v, l) { return v < -l ? -l : (v > l ? l : v) }

		var pressed = false
		var timeScale = 1
		var ANIMON_KEY = 'dsh-liquid-glass-input.animon'
		var animOn = true
		try { animOn = liqStore.get(ANIMON_KEY) !== '0' } catch (e) {}
		var PRESSCHROME_KEY = 'dsh-liquid-glass-input.presschrome'
		var pressChrome = false
		try { pressChrome = liqStore.get(PRESSCHROME_KEY) === '1' } catch (e) {}
		function setPressChrome(v) {
			pressChrome = v
			try { liqStore.set(PRESSCHROME_KEY, v ? '1' : '0') } catch (e) {}
		}
		function isPressExempt(t, card) {
			if (pressChrome) return false
			if (!t || !t.closest) return false
			try {
				if (t.closest('button, a, [role="button"], [role="listbox"], [role="combobox"], [role="menu"]')) return true
				if (t.closest('[data-liq-part="row"]')) return true
				if (card) {
					var slot = t.closest('[data-slot]')
					if (slot && card.contains(slot) && slot !== card) return true
				}
			} catch (e) {}
			return false
		}
		function setAnimOn(v) {
			animOn = v
			try { liqStore.set(ANIMON_KEY, v ? '1' : '0') } catch (e) {}
			if (!v) {
				pressed = false
				if (rafId) { cancelAnimationFrame(rafId); rafId = 0 }
				if (cardEl) { cardEl.style.transform = ''; cardEl.style.boxShadow = '' }
			} else {
				kick()
			}
		}
		var SPEED_KEY = 'dsh-liquid-glass-input.speed'
		try {
			var savedTs = parseFloat(liqStore.get(SPEED_KEY))
			if (savedTs >= .35 && savedTs <= 3) timeScale = savedTs
		} catch (e) {}

		var AMP_KEY = 'dsh-liquid-glass-input.amplitude'
		var amplitude = 0.6
		try {
			var savedAmp = parseFloat(liqStore.get(AMP_KEY))
			if (savedAmp >= .3 && savedAmp <= 2) amplitude = savedAmp
		} catch (e) {}
		function pressTarget() { return 1 + amplitude * .15 }

		var BLUR_KEY = 'dsh-liquid-glass-input.blur'
		var BLURON_KEY = 'dsh-liquid-glass-input.bluron'
		var blurVal = 1
		var blurOn = true
		try {
			var savedBlur = parseFloat(liqStore.get(BLUR_KEY))
			if (savedBlur >= 0 && savedBlur <= 8) blurVal = savedBlur
			blurOn = liqStore.get(BLURON_KEY) !== '0'
		} catch (e) {}
		var blurEl = null
		function applyBlur() {
			if (blurEl) blurEl.setAttribute('stdDeviation', blurOn ? blurVal : 0)
		}
		function setBlurOn(v) {
			blurOn = v
			try { liqStore.set(BLURON_KEY, v ? '1' : '0') } catch (e) {}
			applyBlur()
		}
		function setBlurVal(v) {
			blurVal = v
			try { liqStore.set(BLUR_KEY, String(v)) } catch (e) {}
			applyBlur()
		}

		// ---- 液态玻璃分层控制（放大/折射/高光）----
		var LAYER_KEYS = ['lsmagon', 'lsmagk', 'lsrefon', 'lsrefk', 'lsspeon', 'lsspecmul']
		var magOn = true, magMul = 1, refOn = true, refMul = 1, specOn = true, specMul = 1
		var satOn = true, satVal = 9
		try {
			magOn = liqStore.get('dsh-liquid-glass-input.' + LAYER_KEYS[0]) !== '0'
			refOn = liqStore.get('dsh-liquid-glass-input.' + LAYER_KEYS[2]) !== '0'
			specOn = liqStore.get('dsh-liquid-glass-input.' + LAYER_KEYS[4]) !== '0'
			satOn = liqStore.get('dsh-liquid-glass-input.saton') !== '0'
			var _mk = parseFloat(liqStore.get('dsh-liquid-glass-input.' + LAYER_KEYS[1]))
			if (_mk >= 0 && _mk <= 2) magMul = _mk
			var _rk = parseFloat(liqStore.get('dsh-liquid-glass-input.' + LAYER_KEYS[3]))
			if (_rk >= 0 && _rk <= 2) refMul = _rk
			var _sm = parseFloat(liqStore.get('dsh-liquid-glass-input.' + LAYER_KEYS[5]))
			if (_sm >= 0 && _sm <= 3) specMul = _sm
			var _sv = parseFloat(liqStore.get('dsh-liquid-glass-input.satval'))
			if (_sv >= 1 && _sv <= 20) satVal = _sv
		} catch (e) {}

		function applyGlassParams() {
			if (magDispEl) magDispEl.setAttribute('scale', (magOn ? spMag.x * magMul : 0).toFixed(2))
			if (refractDispEl) refractDispEl.setAttribute('scale', (refOn ? REFRACT_BASE * spU.x * refMul : 0).toFixed(2))
			if (specFnEl) specFnEl.setAttribute('slope', (specOn ? 0.5 * specMul : 0).toFixed(2))
			if (satMatEl) satMatEl.setAttribute('values', satOn ? String(satVal) : '1')
		}
		function setSat(on, v) {
			satOn = on; satVal = v
			try {
				liqStore.set('dsh-liquid-glass-input.saton', on ? '1' : '0')
				liqStore.set('dsh-liquid-glass-input.satval', String(v))
			} catch (e) {}
			applyGlassParams()
		}
		function setMag(on, k) {
			magOn = on; magMul = k
			try {
				liqStore.set('dsh-liquid-glass-input.lsmagon', on ? '1' : '0')
				liqStore.set('dsh-liquid-glass-input.lsmagk', String(k))
			} catch (e) {}
			applyGlassParams()
		}
		function setRef(on, k) {
			refOn = on; refMul = k
			try {
				liqStore.set('dsh-liquid-glass-input.lsrefon', on ? '1' : '0')
				liqStore.set('dsh-liquid-glass-input.lsrefk', String(k))
			} catch (e) {}
			applyGlassParams()
		}
		function setSpec(on, m) {
			specOn = on; specMul = m
			try {
				liqStore.set('dsh-liquid-glass-input.lsspeon', on ? '1' : '0')
				liqStore.set('dsh-liquid-glass-input.lsspecmul', String(m))
			} catch (e) {}
			applyGlassParams()
		}

		// ---- 亚克力着色 ----
		var MODE_KEY = 'dsh-liquid-glass-input.acrylicmode'
		var TINT_KEY = 'dsh-liquid-glass-input.tint'
		var TINTON_KEY = 'dsh-liquid-glass-input.tinton'
		var acrylicMode = 'system'
		var tintAlpha = .2
		var tintOn = true
		try {
			var savedMode = liqStore.get(MODE_KEY)
			if (savedMode === 'light' || savedMode === 'dark' || savedMode === 'system') acrylicMode = savedMode
			var savedTint = parseFloat(liqStore.get(TINT_KEY))
			if (savedTint >= 0 && savedTint <= .5) tintAlpha = savedTint
			tintOn = liqStore.get(TINTON_KEY) !== '0'
		} catch (e) {}
		function applyAcrylic() {
			var root = document.documentElement
			if (tintOn) {
				root.classList.add('liq-acrylic')
				root.setAttribute('data-liq-mode', acrylicMode)
				root.style.setProperty('--liq-alpha', tintAlpha.toFixed(2))
			} else {
				root.classList.remove('liq-acrylic')
			}
		}
		function setTintOn(v) {
			tintOn = !!v
			try { liqStore.set(TINTON_KEY, tintOn ? '1' : '0') } catch (e) {}
			applyAcrylic()
		}
		function setAcrylicMode(m) {
			acrylicMode = m
			try { liqStore.set(MODE_KEY, m) } catch (e) {}
			applyAcrylic()
		}
		function setTint(v) {
			tintAlpha = v
			try { liqStore.set(TINT_KEY, String(v)) } catch (e) {}
			applyAcrylic()
		}

		// ---- 输入卡宽高 ----
		var CW_KEY = 'dsh-liquid-glass-input.cw'
		var CH_KEY = 'dsh-liquid-glass-input.ch'
		var HMODE_KEY = 'dsh-liquid-glass-input.chmode'
		var cardW = 100
		var cardH = 70
		var hMode = 'fixed'
		try {
			var savedCw = parseFloat(liqStore.get(CW_KEY))
			if (savedCw >= 55 && savedCw <= 100) cardW = savedCw
			var savedCh = parseFloat(liqStore.get(CH_KEY))
			if (savedCh >= 50 && savedCh <= 240) cardH = savedCh
			var savedHm = liqStore.get(HMODE_KEY)
			if (savedHm === 'fixed' || savedHm === 'grow') hMode = savedHm
		} catch (e) {}
		function applySize() {
			document.documentElement.classList.add('liq-glass-size')
			document.documentElement.style.setProperty('--liq-cw', cardW.toFixed(0) + '%')
			if (cardH > 0 && hMode !== 'default') {
				document.documentElement.setAttribute('data-liq-h', hMode)
				document.documentElement.style.setProperty('--liq-ch', cardH.toFixed(0) + 'px')
				try {
					var card = document.querySelector('[data-composer-card]')
					if (card) stampLiqParts(card)
					var g = document.querySelector('[data-composer-card] [data-liq-part="grow"]')
					if (g) { g.style.marginTop = ''; g.style.transform = ''; g.style.paddingBottom = '' }
				} catch (e) {}
			} else {
				hMode = 'default'
				document.documentElement.removeAttribute('data-liq-h')
			}
		}
		function setCardSize(w, h) {
			cardW = w; cardH = h
			try { liqStore.set(CW_KEY, String(w)); liqStore.set(CH_KEY, String(h)) } catch (e) {}
			applySize()
			try { hlVertAlign() } catch (e) {}
		}
		function setHMode(m) {
			hMode = m
			try { liqStore.set(HMODE_KEY, m) } catch (e) {}
			applySize()
			try { hlVertAlign() } catch (e) {}
		}

		// ---- 侧边按钮居中 ----
		var SIDEBTN_KEY = 'dsh-liquid-glass-input.sidebtn'
		var sideBtn = true
		try { sideBtn = liqStore.get(SIDEBTN_KEY) === '1' } catch (e) {}
		function applySideBtn() {
			document.documentElement.classList.toggle('liq-side-btns', sideBtn)
		}
		function setSideBtn(v) {
			sideBtn = v
			try { liqStore.set(SIDEBTN_KEY, v ? '1' : '0') } catch (e) {}
			applySideBtn()
			if (!v) hlResetLayout()
			else { try { hlVertAlign() } catch (e) {} }
		}

		var NUDGE_KEY = 'dsh-liquid-glass-input.nudge'
		var INSET_KEY = 'dsh-liquid-glass-input.inset'
		var ROWINSET_KEY = 'dsh-liquid-glass-input.rowinset'
		var ROWY_KEY = 'dsh-liquid-glass-input.rowy'
		var rowInset = 42
		var rowY = 8
		try {
			var savedRow = parseFloat(liqStore.get(ROWINSET_KEY))
			if (savedRow >= 0 && savedRow <= 80) rowInset = savedRow
			var savedRowY = parseFloat(liqStore.get(ROWY_KEY))
			if (savedRowY >= -20 && savedRowY <= 24) rowY = savedRowY
		} catch (e) {}
		function applyRowInset() {
			document.documentElement.style.setProperty('--liq-rowinset', rowInset.toFixed(0) + 'px')
		}
		function applyRowY() {
			document.documentElement.style.setProperty('--liq-rowy', rowY.toFixed(0) + 'px')
			try { hlVertAlign() } catch (e) {}
		}

		var FADETOP_KEY = 'dsh-liquid-glass-input.fadetop'
		var FADEBOT_KEY = 'dsh-liquid-glass-input.fadebot'
		var fadeTop = 36
		var fadeBot = 36
		try {
			var savedFt = parseFloat(liqStore.get(FADETOP_KEY))
			if (savedFt >= 0 && savedFt <= 80) fadeTop = savedFt
			var savedFb = parseFloat(liqStore.get(FADEBOT_KEY))
			if (savedFb >= 0 && savedFb <= 80) fadeBot = savedFb
		} catch (e) {}
		function applyFade() {
			document.documentElement.style.setProperty('--liq-fade-top', fadeTop.toFixed(0) + 'px')
			document.documentElement.style.setProperty('--liq-fade-bot', fadeBot.toFixed(0) + 'px')
		}

		function applyNudge() {
			try { hlVertAlign() } catch (e) {}
		}
		function applyInset() {
			document.documentElement.style.setProperty('--liq-inset', insetPx.toFixed(0) + 'px')
		}

		function setPressed(p) {
			pressed = p
			spU.t = p ? 1 : .8
			spMag.t = p ? 48 : 24
			spBase.t = p ? pressTarget() : 1
			spT.t = p ? 4 : 0
			spD.t = p ? 16 : 4
			spRe.t = p ? 24 : 9
			spK.t = p ? .22 : .16
			spNe.t = p ? .27 : .2
			kick()
		}

		var cardEl = null, magDispEl = null, refractDispEl = null, specFnEl = null, satMatEl = null, rafId = 0, lastTs = 0
		var lastTransform = '', lastShadow = '', lastMagScale = '', lastRefractScale = ''

		function step(ts) {
			if (!animOn) { rafId = 0; return }
			var dt = Math.min((ts - lastTs) / 1000 || 0.016, 1 / 30) * timeScale
			lastTs = ts
			var settled = true
			for (var i = 0; i < ALL.length; i++) {
				var s = ALL[i]
				// b 弹簧动态跟踪 _ 的实时值（原版 b=spring(()=>_.get(),...)）
				if (s === spB) s.t = spBase.x
				var a = (s.t - s.x) * s.k - s.c * s.v
				s.v += a * dt
				s.x += s.v * dt
				if (Math.abs(s.t - s.x) > SPRING_EPS || Math.abs(s.v) > 0.002) settled = false
			}
			// 按住拖拽单边膨胀：朝偏移方向的边缘鼓出并对侧钉住，按住期间持续保持
			strX += (strTX - strX) * Math.min(1, dt * strRate)
			strY += (strTY - strY) * Math.min(1, dt * strRate)
			var strQuiet = Math.abs(strTX - strX) < .4 && Math.abs(strTY - strY) < .4
			if (!strQuiet || pressed) settled = false
			if (cardEl) {
				var sy = spB.x
				var sx = spBase.x + (1 - spB.x)
				var bxW = curW > 40 ? curW : 780
				var bhH = curH > 30 ? curH : 116
				sx *= 1 + Math.abs(strX) / bxW
				sy *= 1 + Math.abs(strY) / bhH
				curSx = sx; curSy = sy; curTx = strX / 2; curTy = strY / 2
				var tStr = 'translate(' + (strX / 2).toFixed(2) + 'px,' + (strY / 2).toFixed(2) + 'px) scale(' + sx.toFixed(4) + ',' + sy.toFixed(4) + ')'
				if (tStr !== lastTransform) {
					cardEl.style.transform = tStr; lastTransform = tStr
					if (hlEnabled && hlPxEl) hlPxEl.style.transform = tStr
				}
				var sStr =
					spT.x.toFixed(2) + 'px ' + spD.x.toFixed(2) + 'px ' + spRe.x.toFixed(2) + 'px rgba(0,0,0,' + clampA(spK.x) + '),' +
					' inset ' + (spT.x / 2).toFixed(2) + 'px ' + (spD.x / 2).toFixed(2) + 'px 24px rgba(0,0,0,' + clampA(spNe.x) + '),' +
					' inset ' + (-spT.x / 2).toFixed(2) + 'px ' + (-spD.x / 2).toFixed(2) + 'px 24px rgba(255,255,255,' + clampA(spNe.x) + ')'
				if (sStr !== lastShadow) { cardEl.style.boxShadow = sStr; lastShadow = sStr }
			}
			if (magDispEl) {
				var mScale = (magOn ? spMag.x * magMul : 0).toFixed(2)
				if (mScale !== lastMagScale) { magDispEl.setAttribute('scale', mScale); lastMagScale = mScale }
			}
			if (refractDispEl) {
				var rScale = ((refOn ? REFRACT_BASE * spU.x * refMul : 0)).toFixed(2)
				if (rScale !== lastRefractScale) { refractDispEl.setAttribute('scale', rScale); lastRefractScale = rScale }
			}
			if (settled) {
				// 只有松手后落定才清内联样式；按住期间落定要保留按压态，否则会瞬间跳回初始外观
				if (!pressed && cardEl) {
					cardEl.style.transform = ''
					cardEl.style.boxShadow = ''
					if (hlPxEl) hlPxEl.style.transform = ''
					curSx = 1; curSy = 1; curTx = 0; curTy = 0
					lastTransform = ''; lastShadow = ''; lastMagScale = ''; lastRefractScale = ''
					strX = 0; strY = 0; strTX = 0; strTY = 0
				}
				rafId = 0
				return
			}
			rafId = requestAnimationFrame(step)
		}

		function clampA(v) { return v < 0 ? 0 : (v > 1 ? 1 : v.toFixed(3)) }

		function kick() {
			if (rafId || !animOn) return
			lastTs = performance.now()
			rafId = requestAnimationFrame(step)
		}

		// ---- 点击像素增艳（直接改玻璃背景像素的饱和度/亮度，不再叠白色柔光遮罩）----
		var HL_KEY = 'dsh-liquid-glass-input.highlight'
		var HLS_KEY = 'dsh-liquid-glass-input.hlsat'
		var HLB_KEY = 'dsh-liquid-glass-input.hlbri'
		var HLZ_KEY = 'dsh-liquid-glass-input.hlsize'
		var HLF_KEY = 'dsh-liquid-glass-input.hlsoft'
		var hlEnabled = true
		var hlSat = 2.2
		var hlBri = 1.25
		var hlSize = 200
		var hlSoft = 100
		try {
			hlEnabled = liqStore.get(HL_KEY) !== '0'
			var _hs = parseFloat(liqStore.get(HLS_KEY))
			if (_hs >= 1 && _hs <= 5) hlSat = _hs
			var _hb = parseFloat(liqStore.get(HLB_KEY))
			if (_hb >= 1 && _hb <= 2.5) hlBri = _hb
			var _hz = parseFloat(liqStore.get(HLZ_KEY))
			if (_hz >= 40 && _hz <= 300) hlSize = _hz
			var _hf = parseFloat(liqStore.get(HLF_KEY))
			if (_hf >= 0 && _hf <= 100) hlSoft = _hf
		} catch (e) {}
		var overlayEl = null

		// 增艳层：卡片自己的兄弟元素，DOM 上排在卡片前（画在玻璃之下），
		// 自带 backdrop-filter 提饱和/提亮，CSS 径向渐变 mask 圈出指针区域。
		// 不走 liq-mag 滤镜链——滤镜内动态蒙版两种做法都静默失效过；
		// 纯 CSS mask 移动只是图层合成，不会触发大面积滤镜重栅格化
		var HL_R_BASE = 130
		var HL_FADE_MS = 220
		var hlPxEl = null
		var hlLx = 0, hlLy = 0
		var hlHideTimer = 0
		var hlSyncRect = null
		var curSx = 1, curSy = 1, curTx = 0, curTy = 0

		function applyHlVars() {
			if (!hlPxEl) return
			hlPxEl.style.setProperty('--liq-hls', String(hlSat))
			hlPxEl.style.setProperty('--liq-hlb', String(hlBri))
			hlPxEl.style.setProperty('--liq-hlr', Math.max(30, HL_R_BASE * hlSize / 100).toFixed(0) + 'px')
			// 细腻度 0~100 → 渐变核心/终点两个 stop：小=凝聚锐利，大=柔和弥散
			hlPxEl.style.setProperty('--liq-hlc', (65 - hlSoft * 0.5).toFixed(1) + '%')
			hlPxEl.style.setProperty('--liq-hle', Math.min(98, 71 + hlSoft * 0.5).toFixed(1) + '%')
		}
		function applyHlPos() {
			if (!hlPxEl) return
			hlPxEl.style.setProperty('--lx', hlLx.toFixed(1) + 'px')
			hlPxEl.style.setProperty('--ly', hlLy.toFixed(1) + 'px')
		}
		function applyHlPx(onOff) {
			if (!hlPxEl) return
			if (onOff) {
				if (hlHideTimer) { clearTimeout(hlHideTimer); hlHideTimer = 0 }
				applyHlVars()
				applyHlPos()
				hlPxEl.classList.add('on')
			} else {
				hlPxEl.style.setProperty('--liq-hls', '1')
				hlPxEl.style.setProperty('--liq-hlb', '1')
				if (hlHideTimer) clearTimeout(hlHideTimer)
				hlHideTimer = setTimeout(function () {
					hlHideTimer = 0
					if (hlPxEl) hlPxEl.classList.remove('on')
				}, HL_FADE_MS + 40)
			}
		}
		// 指针移动即时更新 mask 圆心（CSS mask 重绘开销小，无需合帧）
		function hlQueueMove() {
			if (hlPxEl) applyHlPos()
		}
		function setHlSat(v) {
			hlSat = v
			try { liqStore.set(HLS_KEY, String(v)) } catch (e) {}
			if (pressed && hlEnabled) applyHlVars()
		}
		function setHlBri(v) {
			hlBri = v
			try { liqStore.set(HLB_KEY, String(v)) } catch (e) {}
			if (pressed && hlEnabled) applyHlVars()
		}
		function setHlSize(v) {
			hlSize = v
			try { liqStore.set(HLZ_KEY, String(v)) } catch (e) {}
			if (pressed && hlEnabled) applyHlVars()
		}
		function setHlSoft(v) {
			hlSoft = v
			try { liqStore.set(HLF_KEY, String(v)) } catch (e) {}
			if (pressed && hlEnabled) applyHlVars()
		}

		function setHl(v) {
			hlEnabled = v
			try { liqStore.set(HL_KEY, v ? '1' : '0') } catch (e) {}
			if (overlayEl) overlayEl.style.display = v ? '' : 'none'
			if (!v) { try { applyHlPx(false) } catch (e) {} }
		}

		// ---- 性能监视（调试用）：右上角实时帧率 ----
		var FPS_KEY = 'dsh-liquid-glass-input.fpsdbg'
		var fpsDbg = false
		try { fpsDbg = liqStore.get(FPS_KEY) === '1' } catch (e) {}
		var fpsEl = null, fpsRaf = 0, fpsFrames = 0, fpsT0 = 0
		function ensureFps() {
			if (!fpsDbg) {
				if (fpsRaf) { cancelAnimationFrame(fpsRaf); fpsRaf = 0 }
				if (fpsEl) { fpsEl.remove(); fpsEl = null }
				return
			}
			if (!fpsEl && document.body) {
				fpsEl = document.createElement('div')
				fpsEl.id = 'liq-fps-badge'
				fpsEl.textContent = '-- FPS'
				fpsEl.style.cssText = 'position:fixed;top:10px;right:12px;z-index:2147483647;pointer-events:none;' +
					'font:600 12px/1.6 ui-monospace,Consolas,monospace;color:#7ee787;background:rgba(0,0,0,.55);' +
					'padding:2px 10px;border-radius:999px;'
				document.body.appendChild(fpsEl)
				fpsFrames = 0
				fpsT0 = performance.now()
			}
			if (fpsEl && !fpsRaf) {
				fpsRaf = requestAnimationFrame(function loop(ts) {
					fpsFrames++
					if (ts - fpsT0 >= 500) {
						fpsEl.textContent = Math.round(fpsFrames * 1000 / (ts - fpsT0)) + ' FPS'
						fpsFrames = 0
						fpsT0 = ts
					}
					fpsRaf = requestAnimationFrame(loop)
				})
			}
		}
		function setFpsDebug(v) {
			fpsDbg = v
			try { liqStore.set(FPS_KEY, v ? '1' : '0') } catch (e) {}
			ensureFps()
		}
		try { if (document.body) ensureFps(); else window.addEventListener('load', function () { ensureFps() }) } catch (e) {}

		var attachedEl = null, detachFns = []

		function liqPart(el, name) {
			if (!el || !el.setAttribute) return
			if (el.getAttribute('data-liq-part') !== name) el.setAttribute('data-liq-part', name)
		}
		function liqHasSuffix(el, suffix) {
			var cl = el && el.className
			if (!cl) return false
			var s = typeof cl === 'string' ? cl : (cl.baseVal || '')
			return (s + ' ').indexOf('_' + suffix + ' ') !== -1 || s.slice(-(suffix.length + 1)) === '_' + suffix
		}
		function stampLiqParts(card) {
			if (!card || !card.querySelector) return
			var scroll = card.querySelector('[data-input-scroll]')
			if (scroll && scroll.firstElementChild) liqPart(scroll.firstElementChild, 'grow')
			var ta = card.querySelector('textarea')
			if (ta) liqPart(ta, 'input')
			var addBtn = card.querySelector('button[aria-haspopup="listbox"]')
			if (!addBtn) {
				var allBtn = card.querySelectorAll('button')
				for (var bi = 0; bi < allBtn.length; bi++) {
					if (liqHasSuffix(allBtn[bi], 'add')) { addBtn = allBtn[bi]; break }
				}
			}
			if (addBtn) liqPart(addBtn, 'add')
			var row = addBtn
			while (row && row.parentElement && row.parentElement !== card) row = row.parentElement
			if (!row || row === card) {
				row = null
				if (scroll) {
					var sib = scroll.nextElementSibling
					while (sib && (sib.classList.contains('liq-highlight') || sib.classList.contains('liq-hlpx'))) sib = sib.nextElementSibling
					if (sib && sib.querySelector && sib.querySelector('button')) row = sib
				}
			}
			if (row && row !== scroll && row !== card) {
				liqPart(row, 'row')
				var tools = row.firstElementChild
				var trailing = row.lastElementChild
				if (tools) {
					liqPart(tools, 'tools')
					var tch = tools.children
					for (var ti = 0; ti < tch.length; ti++) {
						if (addBtn && tch[ti].contains(addBtn)) continue
						if (tch[ti].tagName === 'DIV') { liqPart(tch[ti], 'modes'); break }
					}
				}
				if (trailing && trailing !== tools) {
					liqPart(trailing, 'trailing')
					var pbtns = trailing.querySelectorAll('button')
					var stamped = 0
					for (var pj = 0; pj < pbtns.length; pj++) {
						if (liqHasSuffix(pbtns[pj], 'primary')) { liqPart(pbtns[pj], 'primary'); stamped++ }
					}
					if (!stamped && pbtns.length) liqPart(pbtns[pbtns.length - 1], 'primary')
				}
			}
		}

		function tryAttach(card) {
			if (!card) return
			try { stampLiqParts(card) } catch (e) {}
			if (card === attachedEl) return
			detachFns.forEach(function (f) { f() })
			detachFns = []
			attachedEl = card
			cardEl = card

			overlayEl = document.createElement('div')
			overlayEl.className = 'liq-highlight'
			overlayEl.style.display = hlEnabled ? '' : 'none'
			card.appendChild(overlayEl)
			try { hlVertAlign() } catch (e) {}
			var growWatch = card.querySelector('[data-input-mirror]')
			if (growWatch && typeof ResizeObserver !== 'undefined') {
				var lastMirrorH = -1
				var growRo = new ResizeObserver(function (entries) {
					var h = entries && entries[0] && entries[0].contentRect ? entries[0].contentRect.height : 0
					if (Math.abs(h - lastMirrorH) < 0.5) return
					lastMirrorH = h
					try { followCaretScroll() } catch (e) {}
				})
				growRo.observe(growWatch)
				detachFns.push(function () { growRo.disconnect() })
			}
			var taWatch = card.querySelector('textarea')
			if (taWatch) {
				function onCaretMove() { try { followCaretScroll() } catch (e) {} }
				function onKeyMove(e) {
					var k = e && e.key
					if (k === 'ArrowUp' || k === 'ArrowDown' || k === 'Home' || k === 'End' || k === 'Enter') onCaretMove()
				}
				taWatch.addEventListener('keydown', onKeyMove)
				taWatch.addEventListener('click', onCaretMove)
				detachFns.push(function () {
					taWatch.removeEventListener('keydown', onKeyMove)
					taWatch.removeEventListener('click', onCaretMove)
				})
			}

			hlPxEl = document.createElement('div')
			hlPxEl.className = 'liq-hlpx'
			var hlPxInner = document.createElement('div')
			hlPxInner.className = 'liq-hlpxi'
			hlPxEl.appendChild(hlPxInner)
			try {
				if (card.parentNode) card.parentNode.insertBefore(hlPxEl, card)
				else hlPxEl = null
			} catch (e) { hlPxEl = null }

			var hpressed = false
			var hlRect = null
			function refreshRect() {
				// 按住中、或连点时上轮回缩 transform 还没清，矩形都带着变形；
				// 量进去再叠镜像等于二次变换（v1.23.3 连点溢出的根源），此时沿用旧矩形即可
				if (!card.offsetWidth || hpressed || lastTransform !== '') return
				hlRect = card.getBoundingClientRect()
				if (hlPxEl) {
					hlPxEl.style.left = hlRect.left + 'px'
					hlPxEl.style.top = hlRect.top + 'px'
					hlPxEl.style.width = hlRect.width + 'px'
					hlPxEl.style.height = hlRect.height + 'px'
				}
			}
			hlSyncRect = refreshRect
			refreshRect()
			function pos(e) {
				if (!hlRect) return
				// 换算回未变形的本地坐标：玻璃当前有缩放/平移，直接减 left 会往边缘外漂
				hlLx = ((e.clientX - hlRect.left) - curTx) / (curSx || 1)
				hlLy = ((e.clientY - hlRect.top) - curTy) / (curSy || 1)
			}
			var pressFromTextarea = false
			function textareaHasText() {
				var ta = card.querySelector('textarea')
				return !!(ta && ta.value)
			}
			function down(e) {
				if (isPressExempt(e.target, card)) return
				pressFromTextarea = !!(e.target && e.target.closest && e.target.closest('textarea'))
				refreshRect(); pos(e)
				setPressed(true); hpressed = true
				strOx = e.clientX; strOy = e.clientY
				strTX = 0; strTY = 0
				if (hlEnabled) applyHlPx(true)
			}
			function move(e) {
				if (!hpressed) return
				if (!pressChrome && pressFromTextarea && textareaHasText()) {
					var dx = e.clientX - strOx, dy = e.clientY - strOy
					if (dx * dx + dy * dy > 36) { up(e); return }
				}
				pos(e)
				if (hlEnabled) hlQueueMove()
				if (animOn && stretchOn) {
					strTX = clampLim((e.clientX - strOx) * strSens, strMax)
					strTY = clampLim((e.clientY - strOy) * strSens * .8, strMax)
					kick()
				}
			}
			function up() {
				if (!hpressed) return
				setPressed(false); hpressed = false; strTX = 0; strTY = 0; kick(); applyHlPx(false)
			}
			card.addEventListener('pointerdown', down)
			card.addEventListener('pointermove', move)
			window.addEventListener('pointerup', up)
			window.addEventListener('pointercancel', up)
			window.addEventListener('blur', up)
			detachFns.push(function () {
				card.removeEventListener('pointerdown', down)
				card.removeEventListener('pointermove', move)
				window.removeEventListener('pointerup', up)
				window.removeEventListener('pointercancel', up)
				window.removeEventListener('blur', up)
				if (hlHideTimer) { clearTimeout(hlHideTimer); hlHideTimer = 0 }
				hlSyncRect = null
				if (hlPxEl) { hlPxEl.remove(); hlPxEl = null }
				overlayEl.remove()
				overlayEl = null
				attachedEl = null
				cardEl = null
				hlResetLayout()
			})
		}

		// ---- 文本容器一次性垂直对齐（仅侧边按钮模式开启时生效）----
		// 用 margin-top 走布局流（不用 transform，避免滚动容器溢出伪影），
		// 只在挂载/尺寸变化时算一次；关开关时清除全部内联样式
		var VERT_NUDGE = 0
		var insetPx = 36
		try {
			var savedNudge = parseFloat(liqStore.get(NUDGE_KEY))
			if (savedNudge >= 0 && savedNudge <= 30) VERT_NUDGE = savedNudge
			var savedInset = parseFloat(liqStore.get(INSET_KEY))
			if (savedInset >= 20 && savedInset <= 140) insetPx = savedInset
		} catch (e) {}
		var caretProbe = null
		var caretMark = null
		var caretText = null
		var caretMetrics = { w: -1, lineH: 24, padTop: 4 }
		function ensureCaretProbe() {
			if (caretProbe) return
			caretProbe = document.createElement('div')
			caretProbe.setAttribute('aria-hidden', 'true')
			caretProbe.style.cssText = 'position:fixed;left:-9999px;top:0;visibility:hidden;pointer-events:none;white-space:pre-wrap;word-break:break-word;overflow-wrap:anywhere;'
			caretText = document.createTextNode('')
			caretMark = document.createElement('span')
			caretMark.textContent = '\u200b'
			caretProbe.appendChild(caretText)
			caretProbe.appendChild(caretMark)
			if (document.body) document.body.appendChild(caretProbe)
		}
		function measureCaret(ta) {
			var lineH = caretMetrics.lineH
			var padTop = caretMetrics.padTop
			if (!ta) return { y: padTop + lineH / 2, lineH: lineH, padTop: padTop }
			var w = ta.clientWidth
			if (w !== caretMetrics.w) {
				var cs = window.getComputedStyle(ta)
				var lh = parseFloat(cs.lineHeight)
				if (lh > 0) lineH = lh
				var pt = parseFloat(cs.paddingTop)
				if (pt >= 0) padTop = pt
				caretMetrics.w = w
				caretMetrics.lineH = lineH
				caretMetrics.padTop = padTop
				ensureCaretProbe()
				caretProbe.style.font = cs.font
				caretProbe.style.lineHeight = cs.lineHeight
				caretProbe.style.letterSpacing = cs.letterSpacing
				caretProbe.style.padding = cs.padding
				caretProbe.style.boxSizing = cs.boxSizing
				caretProbe.style.width = w + 'px'
			} else {
				ensureCaretProbe()
			}
			caretText.nodeValue = ta.value.slice(0, ta.selectionStart || 0)
			var y = caretMark.offsetTop + caretMetrics.lineH / 2
			if (!(y > 0)) y = caretMetrics.padTop + caretMetrics.lineH / 2
			return { y: y, lineH: caretMetrics.lineH, padTop: caretMetrics.padTop }
		}
		var lastLineOff = -1
		function caretHMode() {
			var h = document.documentElement.getAttribute('data-liq-h')
			return h === 'fixed' || h === 'grow' ? h : ''
		}
		function followCaretScroll() {
			if (!cardEl) return
			if (!caretHMode()) return
			var grow = cardEl.querySelector('[data-liq-part="grow"]')
			if (!grow) { try { stampLiqParts(cardEl) } catch (e) {}; grow = cardEl.querySelector('[data-liq-part="grow"]') }
			var scroll = cardEl.querySelector('[data-input-scroll]') || (grow && grow.parentElement)
			var ta = cardEl.querySelector('textarea')
			if (!scroll || !ta) return
			var m = measureCaret(ta)
			var lineOff = m.y - (m.padTop + m.lineH / 2)
			if (lineOff < 0) lineOff = 0
			if (Math.abs(lineOff - lastLineOff) < 0.5) return
			lastLineOff = lineOff
			if (Math.abs(scroll.scrollTop - lineOff) > 0.5) scroll.scrollTop = lineOff
		}

		function hlVertAlign() {
			if (!cardEl) return
			var grow = cardEl.querySelector('[data-liq-part="grow"]')
			if (!grow) { try { stampLiqParts(cardEl) } catch (e) {}; grow = cardEl.querySelector('[data-liq-part="grow"]') }
			if (!grow) return
			var hmode = caretHMode()
			if (hmode) {
				// 垫层按滑杆高度算（自适应也用最低高度，避免越垫卡越高）。打字/换行只改 scrollTop。
				var scroll = grow.parentElement
				if (!scroll) return
				var sh = scroll.clientHeight
				if (!(sh > 0)) return
				var viewH = cardH > 0 ? cardH : sh
				if (hmode === 'fixed') viewH = sh
				var ta = cardEl.querySelector('textarea')
				var m = measureCaret(ta)
				var target = viewH / 2
				if (sideBtn) target += VERT_NUDGE
				var first = m.padTop + m.lineH / 2
				var topPad = target - first
				if (topPad < 0) topPad = 0
				var padStr = topPad.toFixed(1) + 'px'
				if (grow.style.marginTop !== padStr) grow.style.marginTop = padStr
				if (grow.style.paddingBottom !== padStr) grow.style.paddingBottom = padStr
				lastLineOff = -1
				followCaretScroll()
				return
			}
			if (grow.style.paddingBottom) grow.style.paddingBottom = ''
			if (!sideBtn || !overlayEl) return
			var gr = grow.getBoundingClientRect()
			if (!gr.height) return
			var cr = cardEl.getBoundingClientRect()
			var dy = (cr.top + cr.height / 2) - (gr.top + gr.height / 2) + VERT_NUDGE
			var maxDown = cr.bottom - (gr.top + gr.height) - 4
			if (dy > maxDown) dy = maxDown
			if (dy > 0.5 || dy < -0.5) grow.style.marginTop = dy.toFixed(1) + 'px'
		}

		function hlResetLayout() {
			try {
				if (cardEl) {
					var grow = cardEl.querySelector('[data-liq-part="grow"]')
					if (grow) {
						grow.style.transform = ''
						grow.style.marginTop = ''
						grow.style.paddingBottom = ''
						if (grow.parentElement) grow.parentElement.scrollTop = 0
					}
				}
			} catch (e) {}
		}

		function feImage(href, x, y, w, h, result) {
			return react.createElement('feImage', {
				href: href,
				xlinkHref: href,
				x: x, y: y, width: w, height: h,
				preserveAspectRatio: 'none',
				result: result
			})
		}

		function buildFilter(m) {
			var W = m.w, H = m.h
			return react.createElement('filter', { id: 'liq-mag' },
				feImage(MAPS.magnify, 0, 0, W, H, 'magnifying_displacement_map'),
				react.createElement('feDisplacementMap', {
					ref: function (el) { magDispEl = el },
					in: 'SourceGraphic', in2: 'magnifying_displacement_map',
					xChannelSelector: 'R', yChannelSelector: 'G',
					scale: 24, result: 'magnified_source'
				}),
				react.createElement('feGaussianBlur', {
					ref: function (el) { blurEl = el; applyBlur() },
					in: 'magnified_source', stdDeviation: 0, result: 'blurred_source'
				}),
				feImage(m.d, 0, 0, W, H, 'displacement_map'),
				react.createElement('feDisplacementMap', {
					ref: function (el) { refractDispEl = el },
					in: 'blurred_source', in2: 'displacement_map',
					xChannelSelector: 'R', yChannelSelector: 'G',
					scale: REFRACT_BASE * 0.8, result: 'displaced'
				}),
				react.createElement('feColorMatrix', {
					ref: function (el) { satMatEl = el; applyGlassParams() },
					in: 'displaced', type: 'saturate', values: '9', result: 'displaced_saturated'
				}),
				feImage(m.s, 0, 0, W, H, 'specular_layer'),
				react.createElement('feComposite', { in: 'displaced_saturated', in2: 'specular_layer', operator: 'in', result: 'specular_saturated' }),
				react.createElement('feComponentTransfer', { in: 'specular_layer', result: 'specular_faded' },
					react.createElement('feFuncA', {
						ref: function (el) { specFnEl = el; applyGlassParams() },
						type: 'linear', slope: 0.5 * specMul
					})
				),
				react.createElement('feBlend', { in: 'specular_saturated', in2: 'displaced', mode: 'normal', result: 'withSaturation' }),
				react.createElement('feBlend', { in: 'specular_faded', in2: 'withSaturation', mode: 'normal' })
			)
		}

		function GlassDefs() {
			var st = react.useState(null)
			var state = st[0], setState = st[1]
			react.useEffect(function () {
				pushState = setState
				preload().then(function () { measure(true); startCardWatch() })
				startCardWatch()
				return function () {
					stopCardWatch()
					pushState = null
				}
			}, [])
			if (!state) return null
			return react.createElement('svg', {
				style: { position: 'fixed', left: -9999, top: 0, width: state.w, height: state.h },
				colorInterpolationFilters: 'sRGB',
				'aria-hidden': 'true',
				focusable: 'false'
			},
				react.createElement('defs', null, buildFilter(state))
			)
		}

		function Probe() {
			return react.createElement('div', {
				ref: function (n) {
					probeNode = n
					if (n) { bindCardWatch(); measure(false) }
				},
				style: { position: 'absolute', width: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' },
				'aria-hidden': 'true'
			})
		}

		// ---- 玻璃开关（照搬 kube.io demo Switch 关闭 Force active：平时白胶囊，按下才露玻璃并可拖）----
		function buildThumbFilter(id, dispRef, dUrl, sUrl, w, h) {
			dUrl = dUrl || SW_DISPLACE_URL
			sUrl = sUrl || SW_SPEC_URL
			w = w || 146
			h = h || 92
			return react.createElement('filter', { id: id },
				react.createElement('feGaussianBlur', { in: 'SourceGraphic', stdDeviation: 0.2, result: 'blurred_source' }),
				feImage(dUrl, 0, 0, w, h, 'sw_displacement'),
				react.createElement('feDisplacementMap', {
					ref: dispRef,
					in: 'blurred_source', in2: 'sw_displacement',
					xChannelSelector: 'R', yChannelSelector: 'G',
					scale: 22.26, result: 'sw_displaced'
				}),
				react.createElement('feColorMatrix', { in: 'sw_displaced', type: 'saturate', values: '4', result: 'sw_saturated' }),
				feImage(sUrl, 0, 0, w, h, 'sw_specular'),
				react.createElement('feComposite', { in: 'sw_saturated', in2: 'sw_specular', operator: 'in', result: 'sw_spec_sat' }),
				react.createElement('feComponentTransfer', { in: 'sw_specular', result: 'sw_spec_faded' },
					react.createElement('feFuncA', { type: 'linear', slope: 0.5 })
				),
				react.createElement('feBlend', { in: 'sw_spec_sat', in2: 'sw_displaced', mode: 'normal', result: 'sw_with_sat' }),
				react.createElement('feBlend', { in: 'sw_spec_faded', in2: 'sw_with_sat', mode: 'normal' })
			)
		}

		var swUid = 0
		var SW_SCALE_IDLE = 55.65161904498752 * 0.4
		var SW_SCALE_PRESS = 55.65161904498752 * 0.9
		var SW_TRAVEL = 93 - 54 * 0.65

