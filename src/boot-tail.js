		function liqHydrate() {
			try {
				stretchOn = liqStore.get(STRON_KEY) !== '0'
				animOn = liqStore.get(ANIMON_KEY) !== '0'
				pressChrome = liqStore.get(PRESSCHROME_KEY) === '1'
				var ts = parseFloat(liqStore.get(SPEED_KEY)); if (ts >= .35 && ts <= 2) timeScale = ts
				var am = parseFloat(liqStore.get(AMP_KEY)); if (am >= .3 && am <= 2) amplitude = am
				blurOn = liqStore.get(BLURON_KEY) !== '0'
				var bv = parseFloat(liqStore.get(BLUR_KEY)); if (bv >= 0 && bv <= 8) blurVal = bv
				magOn = liqStore.get('dsh-liquid-glass-input.lsmagon') !== '0'
				refOn = liqStore.get('dsh-liquid-glass-input.lsrefon') !== '0'
				specOn = liqStore.get('dsh-liquid-glass-input.lsspeon') !== '0'
				satOn = liqStore.get('dsh-liquid-glass-input.saton') !== '0'
				tintOn = liqStore.get(TINTON_KEY) !== '0'
				sideBtn = liqStore.get(SIDEBTN_KEY) === '1'
				hlEnabled = liqStore.get(HL_KEY) !== '0'
				fpsDbg = liqStore.get(FPS_KEY) === '1'
			} catch (e) {}
			try {
				applyGlassParams()
				applyBlur()
				applyAcrylic()
				applySize()
				applySideBtn()
				applyInset()
				applyRowInset()
				applyRowY()
				applyFade()
				applyHlVars()
				ensureFps()
			} catch (e) {}
		}

		var injected = ['slots']

		function apply(ctx) {
			liqFetchRemoteAsync()
			try {
				applyGlassParams()
				applySideBtn()
				applyInset()
				applyRowInset()
				applyRowY()
				applyFade()
				applyAcrylic()
				applySize()
			} catch (e) {
				console.error('liq apply 初始化错误:', e && e.message)
			}
			ctx.slots.inject('shell.overlay', function () {
				return ctx.slots.register(
					{ name: 'shell.overlay', id: 'liq-mag-filters' },
					GlassDefs
				)
			})
			ctx.slots.inject('settings.section', function () {
				return ctx.slots.register(
					{ name: 'settings.section', id: 'liquid-glass', order: 130, label: liqT('液态玻璃', 'Liquid Glass') },
					GlassSection
				)
			})
			ctx.slots.inject('conversation.input.left', function () {
				return ctx.slots.register(
					{ name: 'conversation.input.left', id: 'liq-probe' },
					Probe
				)
			})
			ctx.effect(function () {
				var disposeCss = null
				ensureCss(function (d) { disposeCss = d })
				return function () {
					detachFns.forEach(function (f) { f() })
					detachFns = []
					if (disposeCss) disposeCss()
					if (caretProbe && caretProbe.parentNode) caretProbe.parentNode.removeChild(caretProbe)
					caretProbe = null
					caretMark = null
					caretText = null
					caretMetrics.w = -1
				}
			})
		}

		exports.NS = 'liq-mag'
		exports.apply = apply
		exports.inject = injected
		return module.exports;
	}
});
