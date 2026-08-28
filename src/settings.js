		function liqKbMove(from, dir) {
			if (!from) return
			var root = from.closest('.liq-settings') || document
			var nodes = root.querySelectorAll('.liq-kb')
			var list = []
			for (var i = 0; i < nodes.length; i++) {
				if (nodes[i].tabIndex < 0) continue
				list.push(nodes[i])
			}
			var at = list.indexOf(from)
			if (at < 0) return
			var nxt = list[at + dir]
			if (!nxt) return
			try { nxt.focus({ preventScroll: false }) } catch (e) {}
			try { nxt.scrollIntoView({ block: 'nearest' }) } catch (e) {}
		}

		function GlassSwitch(props) {
			var options = props.options
			var multi = options && options.length > 2
			var steps = multi ? options.length : 2
			var idx = 0
			if (multi) {
				for (var i = 0; i < steps; i++) if (options[i].value === props.value) idx = i
			} else {
				idx = props.on ? 1 : 0
			}
			var pos01 = steps <= 1 ? 0 : idx / (steps - 1)
			var travel = SW_TRAVEL * (steps - 1)
			var trackW = 160 + SW_TRAVEL * (steps - 2)
			var setOn = props.onChange
			var idRef = react.useRef(null)
			if (idRef.current === null) idRef.current = 'liq-sw-thumb-' + (++swUid)
			var fid = idRef.current
			var dispRef = react.useRef(null)
			var rafRef = react.useRef(0)
			var curRef = react.useRef(SW_SCALE_IDLE)
			var dragRef = react.useRef({ active: false, startX: 0, startOn: 0, moved: 0, pos: pos01 })
			var glassTimer = react.useRef(0)
			var wrapRef = react.useRef(null)
			var bakedRef = react.useRef('')
			var mapSt = react.useState(null)
			var maps = mapSt[0], setMaps = mapSt[1]
			var pressSt = react.useState(false)
			var pressing = pressSt[0], setPressing = pressSt[1]
			var glassSt = react.useState(false)
			var glassOn = glassSt[0], setGlassOn = glassSt[1]
			var posSt = react.useState(pos01)
			var pos = posSt[0], setPos = posSt[1]
			react.useEffect(function () {
				if (!pressing) setPos(pos01)
			}, [pos01])
			function bakeSwitchMaps(el) {
				if (!el || !multi || !SW_DISP_IMG || !SW_SPEC_IMG) return
				var slotW = Math.max(48, Math.round((el.clientWidth - 4) / steps))
				var slotH = 36
				var key = slotW + 'x' + slotH
				if (bakedRef.current === key) return
				var d = composeField(SW_DISP_IMG, slotW, slotH)
				var s = composeField(SW_SPEC_IMG, slotW, slotH)
				if (d && s) {
					bakedRef.current = key
					setMaps({ d: d, s: s, w: slotW, h: slotH })
				}
			}
			react.useEffect(function () {
				if (!multi) return
				var el = wrapRef.current
				bakeSwitchMaps(el)
				if (!el || typeof ResizeObserver === 'undefined') return
				var ro = new ResizeObserver(function () { bakeSwitchMaps(wrapRef.current) })
				ro.observe(el)
				return function () { ro.disconnect() }
			}, [multi, steps])
			function commitSlot(slot) {
				if (slot < 0) slot = 0
				if (slot > steps - 1) slot = steps - 1
				setPos(steps <= 1 ? 0 : slot / (steps - 1))
				if (multi) {
					if (options[slot].value !== props.value) setOn(options[slot].value)
				} else {
					var next = slot > 0
					if (next !== !!props.on) setOn(next)
				}
			}
			react.useEffect(function () {
				function move(e) {
					var d = dragRef.current
					if (!d.active) return
					var n = d.startOn + (e.clientX - d.startX) / (d.travelPx || travel)
					var over = n < 0 ? -n : (n > 1 ? n - 1 : 0)
					var rubber = (n < 0 ? -1 : 1) * over / 22
					var a = Math.min(1, Math.max(0, n)) + rubber
					d.moved = Math.max(d.moved, Math.abs(e.clientX - d.startX))
					d.pos = a
					setPos(a)
				}
				function up() {
					var d = dragRef.current
					if (!d.active) return
					d.active = false
					setPressing(false)
					animScale(SW_SCALE_IDLE)
					if (glassTimer.current) clearTimeout(glassTimer.current)
					glassTimer.current = setTimeout(function () {
						glassTimer.current = 0
						setGlassOn(false)
					}, 220)
					if (d.moved > 4) commitSlot(Math.round(Math.min(1, Math.max(0, d.pos)) * (steps - 1)))
					else setPos(pos01)
				}
				window.addEventListener('pointermove', move)
				window.addEventListener('pointerup', up)
				window.addEventListener('pointercancel', up)
				return function () {
					window.removeEventListener('pointermove', move)
					window.removeEventListener('pointerup', up)
					window.removeEventListener('pointercancel', up)
					if (rafRef.current) cancelAnimationFrame(rafRef.current)
					if (glassTimer.current) clearTimeout(glassTimer.current)
				}
			}, [pos01, steps, travel, multi, props.value, props.on])
			function animScale(target) {
				if (rafRef.current) cancelAnimationFrame(rafRef.current)
				function tick() {
					var el = dispRef.current
					if (!el) { rafRef.current = 0; return }
					var cur = curRef.current
					var nxt = cur + (target - cur) * 0.3
					if (Math.abs(target - nxt) < 0.4) nxt = target
					curRef.current = nxt
					el.setAttribute('scale', nxt.toFixed(2))
					rafRef.current = nxt !== target ? requestAnimationFrame(tick) : 0
				}
				rafRef.current = requestAnimationFrame(tick)
			}
			function focusKb() {
				try { if (wrapRef.current && wrapRef.current.focus) wrapRef.current.focus({ preventScroll: true }) } catch (err) {}
			}
			function down(e) {
				if (props.disabled) return
				focusKb()
				e.preventDefault()
				e.stopPropagation()
				if (glassTimer.current) { clearTimeout(glassTimer.current); glassTimer.current = 0 }
				var travelPx = travel
				if (multi && wrapRef.current) {
					var w = wrapRef.current.getBoundingClientRect().width
					travelPx = (w - 4) * (steps - 1) / steps
				}
				dragRef.current = { active: true, startX: e.clientX, startOn: pos01, moved: 0, pos: pos01, travelPx: travelPx }
				if (multi) bakeSwitchMaps(wrapRef.current)
				setGlassOn(true)
				setPressing(true)
				animScale(SW_SCALE_PRESS)
			}
			function click(e) {
				if (props.disabled) return
				if (dragRef.current.moved > 4) return
				if (multi) {
					var el = wrapRef.current
					if (!el) { commitSlot((idx + 1) % steps); return }
					var r = el.getBoundingClientRect()
					var slot = Math.floor((e.clientX - r.left) / r.width * steps)
					commitSlot(slot)
				} else setOn(!props.on)
			}
			function onKey(e) {
				if (props.disabled) return
				var k = e.key
				if (k === 'ArrowUp' || k === 'ArrowDown') {
					e.preventDefault()
					e.stopPropagation()
					liqKbMove(wrapRef.current, k === 'ArrowDown' ? 1 : -1)
					return
				}
				if (k === ' ' || k === 'Enter') {
					e.preventDefault()
					e.stopPropagation()
					if (multi) commitSlot((idx + 1) % steps)
					else setOn(!props.on)
					return
				}
				if (k === 'ArrowRight' || k === 'ArrowLeft') {
					e.preventDefault()
					e.stopPropagation()
					var fwd = k === 'ArrowRight'
					if (multi) commitSlot(idx + (fwd ? 1 : -1))
					else setOn(fwd)
				}
			}
			var shown = pressing ? pos : pos01
			var trackOn = multi ? false : (pressing ? pos > 0.5 : !!props.on)
			if (multi) {
				var mw = maps && maps.w ? maps.w : 146
				var mh = maps && maps.h ? maps.h : 92
				return react.createElement('div', {
					ref: function (n) { wrapRef.current = n; bakeSwitchMaps(n) },
					className: 'liq-kb',
					role: 'radiogroup',
					tabIndex: props.disabled ? -1 : 0,
					'aria-disabled': props.disabled ? true : undefined,
					onKeyDown: onKey,
					onPointerDown: down,
					onClick: click,
					style: {
						position: 'relative', width: '100%', height: 40, borderRadius: 20,
						backgroundColor: 'rgba(148,148,159,.47)', cursor: props.disabled ? 'default' : 'pointer',
						overflow: 'visible', touchAction: 'none', userSelect: 'none',
						WebkitUserSelect: 'none'
					}
				},
					react.createElement('svg', { style: { position: 'fixed', left: -9999, top: 0, width: mw, height: mh }, colorInterpolationFilters: 'sRGB', 'aria-hidden': 'true', focusable: 'false' },
						react.createElement('defs', null, buildThumbFilter(fid, dispRef, maps && maps.d, maps && maps.s, mw, mh))
					),
					react.createElement('div', {
						style: {
							position: 'absolute', top: '50%', height: 36, marginTop: -18,
							width: 'calc((100% - 4px) / ' + steps + ')',
							left: 'calc(2px + (100% - 4px) * ' + Number(shown).toFixed(4) + ' * ' + (steps - 1) + ' / ' + steps + ')',
							borderRadius: 18,
							zIndex: 2, pointerEvents: 'none',
							transform: 'scale(' + (pressing ? '1.38' : '1') + ')',
							transformOrigin: 'center center',
							transition: pressing
								? 'transform .22s cubic-bezier(.3,.7,.35,1.08), background-color .22s ease, box-shadow .22s ease'
								: 'left .24s cubic-bezier(.3,.7,.35,1.08), transform .22s cubic-bezier(.3,.7,.35,1.08), background-color .22s ease, box-shadow .22s ease',
							backdropFilter: glassOn ? 'url(#' + fid + ')' : 'none',
							backgroundColor: pressing ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,1)',
							boxShadow: pressing
								? '0 4px 22px rgba(0,0,0,.1), inset 2px 7px 24px rgba(0,0,0,.09), inset -2px -7px 24px rgba(255,255,255,.09)'
								: '0 4px 22px rgba(0,0,0,.1)'
						}
					}),
					react.createElement('div', { style: { position: 'absolute', inset: 0, zIndex: 3, display: 'flex', pointerEvents: 'none', userSelect: 'none' } },
						options.map(function (opt, i) {
							return react.createElement('div', {
								key: String(opt.value),
								style: {
									flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
									fontSize: '12px', fontWeight: i === idx ? '700' : '600',
									color: i === idx ? '#1a1a1a' : 'inherit',
									opacity: i === idx ? 1 : .7, userSelect: 'none', pointerEvents: 'none',
									whiteSpace: 'nowrap', lineHeight: 1,
									textShadow: i === idx ? 'none' : '0 1px 2px rgba(0,0,0,.25)'
								}
							}, opt.label)
						})
					)
				)
			}
			var swScale = 0.38
			var swVisW = Math.round(trackW * swScale)
			var swVisH = Math.round(67 * swScale)
			return react.createElement('div', {
				ref: function (n) { wrapRef.current = n },
				className: 'liq-kb',
				role: 'switch',
				tabIndex: props.disabled ? -1 : 0,
				'aria-checked': !!props.on,
				'aria-disabled': props.disabled ? true : undefined,
				onKeyDown: onKey,
				style: {
					display: 'inline-block', width: swVisW, height: swVisH,
					position: 'relative', flexShrink: 0, overflow: 'visible', cursor: props.disabled ? 'default' : 'pointer'
				}
			},
				react.createElement('div', {
					style: {
						position: 'absolute', right: 0, top: '50%', marginTop: -33.5,
						transform: 'scale(' + swScale + ')', transformOrigin: 'right center', lineHeight: 0
					}
				},
				react.createElement('svg', { style: { position: 'fixed', left: -9999, top: 0, width: 146, height: 92 }, colorInterpolationFilters: 'sRGB', 'aria-hidden': 'true', focusable: 'false' },
					react.createElement('defs', null, buildThumbFilter(fid, dispRef))
				),
				react.createElement('div', {
					style: {
						position: 'relative', width: trackW, height: 67, borderRadius: 33.5, cursor: props.disabled ? 'default' : 'pointer',
						backgroundColor: trackOn ? 'rgba(59,191,78,.93)' : 'rgba(148,148,159,.47)',
						transition: 'background-color .22s ease'
					},
					onClick: click
				},
					react.createElement('div', {
						onPointerDown: down,
						style: {
							position: 'absolute', width: 146, height: 92, borderRadius: 46,
							top: 33.5, marginTop: -46,
							left: (-21.95 + shown * travel).toFixed(2) + 'px',
							transform: 'scale(' + (pressing ? '0.90' : '0.65') + ')',
							transition: pressing
								? 'transform .22s cubic-bezier(.3,.7,.35,1.08), background-color .22s ease, box-shadow .22s ease'
								: 'left .24s cubic-bezier(.3,.7,.35,1.08), transform .22s cubic-bezier(.3,.7,.35,1.08), background-color .22s ease, box-shadow .22s ease',
							backdropFilter: glassOn ? 'url(#' + fid + ')' : 'none',
							backgroundColor: pressing ? 'rgba(255,255,255,.1)' : 'rgba(255,255,255,1)',
							boxShadow: pressing
								? '0 4px 22px rgba(0,0,0,.1), inset 2px 7px 24px rgba(0,0,0,.09), inset -2px -7px 24px rgba(255,255,255,.09)'
								: '0 4px 22px rgba(0,0,0,.1)'
						}
					})
				)
				)
			)
		}

		// ---- 玻璃滑条（照搬 kube.io demo Slider 关闭 Force active：平时白胶囊，按下才露玻璃并可拖）----
		function buildSliderFilter(id, dispRef) {
			return react.createElement('filter', { id: id },
				react.createElement('feGaussianBlur', { in: 'SourceGraphic', stdDeviation: 0.2, result: 'sl_blurred' }),
				feImage(SL_DISPLACE_URL, 0, 0, 60, 40, 'sl_displacement'),
				react.createElement('feDisplacementMap', {
					ref: dispRef,
					in: 'sl_blurred', in2: 'sl_displacement',
					xChannelSelector: 'R', yChannelSelector: 'G',
					scale: 33.55, result: 'sl_displaced'
				}),
				react.createElement('feColorMatrix', { in: 'sl_displaced', type: 'saturate', values: '7', result: 'sl_saturated' }),
				feImage(SL_SPEC_URL, 0, 0, 60, 40, 'sl_specular'),
				react.createElement('feComposite', { in: 'sl_saturated', in2: 'sl_specular', operator: 'in', result: 'sl_spec_sat' }),
				react.createElement('feComponentTransfer', { in: 'sl_specular', result: 'sl_spec_faded' },
					react.createElement('feFuncA', { type: 'linear', slope: 0.4 })
				),
				react.createElement('feBlend', { in: 'sl_spec_sat', in2: 'sl_displaced', mode: 'normal', result: 'sl_with_sat' }),
				react.createElement('feBlend', { in: 'sl_spec_faded', in2: 'sl_with_sat', mode: 'normal' })
			)
		}

		var slUid = 0
		var SL_SCALE_IDLE = 83.88118841653394 * 0.4
		var SL_SCALE_PRESS = 83.88118841653394 * 0.9
		var SL_THUMB_W = 60
		var SL_THUMB_H = 40
		var SL_TRACK_H = 8
		var SL_BOX_H = 40
		var SL_SCALE_IDLE_VIS = 0.6
		var SL_SCALE_PRESS_VIS = 1

		function GlassSlider(props) {
			var minV = props.min
			var maxV = props.max
			var stepV = props.step || 1
			var value = props.value
			var onChange = props.onChange
			var disabled = !!props.disabled
			var onChangeRef = react.useRef(onChange)
			onChangeRef.current = onChange
			var disabledRef = react.useRef(disabled)
			disabledRef.current = disabled
			var idRef = react.useRef(null)
			if (idRef.current === null) idRef.current = 'liq-sl-thumb-' + (++slUid)
			var fid = idRef.current
			var dispRef = react.useRef(null)
			var rafRef = react.useRef(0)
			var curRef = react.useRef(SL_SCALE_IDLE)
			var trackRef = react.useRef(null)
			var wrapRef = react.useRef(null)
			var dragRef = react.useRef({ active: false })
			var glassTimer = react.useRef(0)
			var pressSt = react.useState(false)
			var pressing = pressSt[0], setPressing = pressSt[1]
			var glassSt = react.useState(false)
			var glassOn = glassSt[0], setGlassOn = glassSt[1]
			var wSt = react.useState(280)
			var wrapW = wSt[0], setWrapW = wSt[1]
			var dragPctSt = react.useState(null)
			var dragPct = dragPctSt[0], setDragPct = dragPctSt[1]
			react.useEffect(function () {
				var el = wrapRef.current
				if (!el || typeof ResizeObserver === 'undefined') return
				function read() { if (el.clientWidth) setWrapW(el.clientWidth) }
				read()
				var ro = new ResizeObserver(read)
				ro.observe(el)
				return function () { ro.disconnect() }
			}, [])
			function pctOf(v) {
				var span = maxV - minV
				if (!span) return 0
				var p = (v - minV) / span
				return p < 0 ? 0 : (p > 1 ? 1 : p)
			}
			function pctFromX(clientX) {
				var wrap = wrapRef.current
				if (!wrap) return pctOf(value)
				var r = wrap.getBoundingClientRect()
				var vis = SL_THUMB_W * SL_SCALE_IDLE_VIS
				var i = r.left + vis / 2
				var a = r.right - vis / 2
				var o = a - i
				if (o <= 0) return pctOf(value)
				var p = (clientX - i) / o
				return p < 0 ? 0 : (p > 1 ? 1 : p)
			}
			function snapFromPct(p) {
				var raw = minV + p * (maxV - minV)
				var stepped = Math.round(raw / stepV) * stepV
				if (stepped < minV) stepped = minV
				if (stepped > maxV) stepped = maxV
				var s = String(stepV)
				var dot = s.indexOf('.')
				if (dot >= 0) stepped = Number(stepped.toFixed(s.length - dot - 1))
				return stepped
			}
			function applyX(clientX) {
				if (disabledRef.current) return
				var p = pctFromX(clientX)
				setDragPct(p)
				var fn = onChangeRef.current
				if (fn) fn(snapFromPct(p))
			}
			react.useEffect(function () {
				function move(e) {
					if (!dragRef.current.active) return
					applyX(e.clientX)
				}
				function up() {
					if (!dragRef.current.active) return
					dragRef.current.active = false
					setPressing(false)
					setDragPct(null)
					animScale(SL_SCALE_IDLE)
					if (glassTimer.current) clearTimeout(glassTimer.current)
					glassTimer.current = setTimeout(function () {
						glassTimer.current = 0
						setGlassOn(false)
					}, 220)
				}
				window.addEventListener('pointermove', move)
				window.addEventListener('pointerup', up)
				window.addEventListener('pointercancel', up)
				return function () {
					window.removeEventListener('pointermove', move)
					window.removeEventListener('pointerup', up)
					window.removeEventListener('pointercancel', up)
					if (rafRef.current) cancelAnimationFrame(rafRef.current)
					if (glassTimer.current) clearTimeout(glassTimer.current)
				}
			}, [minV, maxV, stepV])
			function animScale(target) {
				if (rafRef.current) cancelAnimationFrame(rafRef.current)
				function tick() {
					var el = dispRef.current
					if (!el) { rafRef.current = 0; return }
					var cur = curRef.current
					var nxt = cur + (target - cur) * 0.3
					if (Math.abs(target - nxt) < 0.4) nxt = target
					curRef.current = nxt
					el.setAttribute('scale', nxt.toFixed(2))
					rafRef.current = nxt !== target ? requestAnimationFrame(tick) : 0
				}
				rafRef.current = requestAnimationFrame(tick)
			}
			react.useEffect(function () {
				if (!disabled) return
				if (!dragRef.current.active) return
				dragRef.current.active = false
				setPressing(false)
				setDragPct(null)
			}, [disabled])
			function down(e) {
				if (disabledRef.current) return
				try { if (wrapRef.current && wrapRef.current.focus) wrapRef.current.focus({ preventScroll: true }) } catch (err) {}
				e.preventDefault()
				e.stopPropagation()
				if (glassTimer.current) { clearTimeout(glassTimer.current); glassTimer.current = 0 }
				dragRef.current.active = true
				setGlassOn(true)
				setPressing(true)
				animScale(SL_SCALE_PRESS)
				applyX(e.clientX)
			}
			function onKey(e) {
				if (disabledRef.current) return
				if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
					e.preventDefault()
					e.stopPropagation()
					liqKbMove(wrapRef.current, e.key === 'ArrowDown' ? 1 : -1)
					return
				}
				var next = value
				if (e.key === 'ArrowRight') next = value + stepV
				else if (e.key === 'ArrowLeft') next = value - stepV
				else if (e.key === 'Home') next = minV
				else if (e.key === 'End') next = maxV
				else return
				e.preventDefault()
				e.stopPropagation()
				if (next < minV) next = minV
				if (next > maxV) next = maxV
				var fn = onChangeRef.current
				if (fn) fn(snapFromPct(pctOf(next)))
			}
			var pct = dragPct != null ? dragPct : pctOf(value)
			var p = pct.toFixed(4)
			var visW = SL_THUMB_W * SL_SCALE_IDLE_VIS
			var pad = (SL_THUMB_W - visW) / 2
			return react.createElement('div', {
				ref: function (n) { wrapRef.current = n },
				className: 'liq-kb',
				role: 'slider',
				tabIndex: disabled ? -1 : 0,
				'aria-valuemin': minV,
				'aria-valuemax': maxV,
				'aria-valuenow': value,
				'aria-disabled': disabled ? true : undefined,
				onKeyDown: onKey,
				style: { width: '100%', height: SL_BOX_H, position: 'relative', touchAction: disabled ? 'auto' : 'none', overflow: 'visible', pointerEvents: disabled ? 'none' : 'auto' }
			},
				react.createElement('svg', { style: { position: 'fixed', left: -9999, top: 0, width: SL_THUMB_W, height: SL_THUMB_H }, colorInterpolationFilters: 'sRGB', 'aria-hidden': 'true', focusable: 'false' },
					react.createElement('defs', null, buildSliderFilter(fid, dispRef))
				),
				react.createElement('div', {
					ref: function (n) { trackRef.current = n },
					onPointerDown: down,
					style: {
						position: 'absolute', left: 0, right: 0,
						top: ((SL_BOX_H - SL_TRACK_H) / 2).toFixed(1) + 'px',
						height: SL_TRACK_H, backgroundColor: 'rgba(137,137,143,.4)',
						borderRadius: SL_TRACK_H / 2, cursor: disabled ? 'default' : 'pointer', overflow: 'hidden'
					}
				},
					react.createElement('div', {
						style: {
							height: SL_TRACK_H,
							width: (pct * 100).toFixed(3) + '%',
							borderRadius: SL_TRACK_H / 2, backgroundColor: '#0377F7',
							transition: pressing ? 'none' : 'width .18s cubic-bezier(.3,.7,.35,1.08)'
						}
					})
				),
				react.createElement('div', {
					onPointerDown: down,
					style: {
						position: 'absolute', top: 0, width: SL_THUMB_W, height: SL_THUMB_H,
						borderRadius: SL_THUMB_H / 2,
						left: 'calc(' + (-pad) + 'px + (100% - ' + visW + 'px) * ' + p + ')',
						transform: 'scale(' + (pressing ? SL_SCALE_PRESS_VIS : SL_SCALE_IDLE_VIS) + ')',
						transition: pressing
							? 'transform .22s cubic-bezier(.3,.7,.35,1.08), background-color .22s ease, box-shadow .22s ease'
							: 'left .18s cubic-bezier(.3,.7,.35,1.08), transform .22s cubic-bezier(.3,.7,.35,1.08), background-color .22s ease, box-shadow .22s ease',
						backdropFilter: glassOn ? 'url(#' + fid + ')' : 'none',
						backgroundColor: pressing ? 'rgba(255,255,255,.1)' : 'rgba(255,255,255,1)',
						boxShadow: '0 3px 14px rgba(0,0,0,.1)',
						cursor: disabled ? 'default' : 'pointer'
					}
				})
			)
		}

		function JumpDigit(props) {
			var ch = String(props.ch)
			var dir = props.dir < 0 ? -1 : 1
			var st = react.useState({ cur: ch, prev: null, gen: 0 })
			var s = st[0], setS = st[1]
			if (s.cur !== ch) {
				s = { cur: ch, prev: s.cur, gen: s.gen + 1 }
				setS(s)
			}
			function done(e) {
				if (!e || e.animationName !== 'liq-tick-in') return
				var gen = s.gen
				setS(function (old) {
					if (old.gen !== gen) return old
					return { cur: old.cur, prev: null, gen: old.gen }
				})
			}
			if (s.prev == null) {
				return react.createElement('span', { className: 'liq-tick-slot' },
					react.createElement('span', { className: 'liq-tick-ch' }, s.cur)
				)
			}
			return react.createElement('span', {
				className: 'liq-tick-slot',
				style: { '--liq-tick-dir': String(dir) },
				onAnimationEnd: done
			},
				react.createElement('span', { className: 'liq-tick-ghost' }, s.cur),
				react.createElement('span', { key: 'o' + s.gen, className: 'liq-tick-out' }, s.prev),
				react.createElement('span', { key: 'i' + s.gen, className: 'liq-tick-in' }, s.cur)
			)
		}

		function GlassTicker(props) {
			var text = String(props.text == null ? '' : props.text)
			var num = parseFloat(text)
			if (!isFinite(num)) num = 0
			var prevNum = react.useRef(num)
			var dirRef = react.useRef(1)
			if (num > prevNum.current) dirRef.current = 1
			else if (num < prevNum.current) dirRef.current = -1
			prevNum.current = num
			var dir = dirRef.current
			var m = text.match(/^(\d+)(\.\d+)?([\s\S]*)$/)
			var intP = m ? m[1] : ''
			var fracP = m && m[2] ? m[2] : ''
			var suf = m ? m[3] : text
			var nodes = []
			var i
			for (i = 0; i < intP.length; i++) {
				nodes.push(react.createElement(JumpDigit, { key: 'i' + (intP.length - 1 - i), ch: intP.charAt(i), dir: dir }))
			}
			for (i = 0; i < fracP.length; i++) {
				var fc = fracP.charAt(i)
				if (fc >= '0' && fc <= '9') nodes.push(react.createElement(JumpDigit, { key: 'f' + i, ch: fc, dir: dir }))
				else nodes.push(react.createElement('span', { key: 'fd' + i, className: 'liq-tick-static' }, fc))
			}
			if (suf) nodes.push(react.createElement('span', { key: 'suf', className: 'liq-tick-static' }, suf))
			return react.createElement('span', {
				className: 'liq-tick',
				style: { width: (props.width || 44) + 'px' }
			}, nodes)
		}

		// ---- 设置页 ----
		var SPEED_KEY = 'dsh-liquid-glass-input.speed'

		function GlassSection() {
			try {
				return GlassSectionInner()
			} catch (e) {
				console.error('liq GlassSection 渲染错误:', e && e.message, e && e.stack)
				return react.createElement('div', { style: { padding: '16px', color: '#e5484d', fontSize: '13px' } },
					liqT('液态玻璃设置渲染出错: ', 'Failed to render liquid-glass settings: ') + (e && e.message ? e.message : String(e)))
			}
		}

		function GlassSectionInner() {
			var langSt = react.useState(0)
			var setLangTick = langSt[1]
			react.useEffect(function () {
				var obs = new MutationObserver(function () { setLangTick(function (n) { return n + 1 }) })
				try { obs.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] }) } catch (e) {}
				return function () { obs.disconnect() }
			}, [])
			var st1 = react.useState(hlEnabled)
			var on = st1[0], setOn = st1[1]
			var st2 = react.useState(timeScale)
			var spd = st2[0], setSpd = st2[1]
			var st3 = react.useState(amplitude)
			var amp = st3[0], setAmp = st3[1]
			var st4 = react.useState(blurOn)
			var blurOnSt = st4[0], setBlurOnSt = st4[1]
			var st5 = react.useState(blurVal)
			var blurV = st5[0], setBlurV = st5[1]
			var st6 = react.useState(sideBtn)
			var sideOn = st6[0], setSideOn = st6[1]
			var st7 = react.useState(VERT_NUDGE)
			var nud = st7[0], setNud = st7[1]
			var st8 = react.useState(insetPx)
			var ins = st8[0], setIns = st8[1]
			var st9 = react.useState(rowInset)
			var rin = st9[0], setRin = st9[1]
			var stRowY = react.useState(rowY)
			var rowYSt = stRowY[0], setRowYSt = stRowY[1]
			var stFt = react.useState(fadeTop)
			var fadeTopSt = stFt[0], setFadeTopSt = stFt[1]
			var stFb = react.useState(fadeBot)
			var fadeBotSt = stFb[0], setFadeBotSt = stFb[1]
			var st10 = react.useState(acrylicMode)
			var mode = st10[0], setMode = st10[1]
			var st11 = react.useState(tintAlpha)
			var tint = st11[0], setTintSt = st11[1]
			var st36 = react.useState(tintOn)
			var tintOnS = st36[0], setTintOnS = st36[1]
			var st12 = react.useState(cardW)
			var cw = st12[0], setCw = st12[1]
			var st13 = react.useState(cardH)
			var ch = st13[0], setCh = st13[1]
			var st14 = react.useState(hMode)
			var chMode = st14[0], setChMode = st14[1]
			var st16 = react.useState(magOn)
			var magOnS = st16[0], setMagOnS = st16[1]
			var st17 = react.useState(magMul)
			var magKS = st17[0], setMagKS = st17[1]
			var st18 = react.useState(refOn)
			var refOnS = st18[0], setRefOnS = st18[1]
			var st19 = react.useState(refMul)
			var refKS = st19[0], setRefKS = st19[1]
			var st20 = react.useState(specOn)
			var specOnS = st20[0], setSpecOnS = st20[1]
			var st21 = react.useState(specMul)
			var specMS = st21[0], setSpecMS = st21[1]
			var st25 = react.useState(animOn)
			var animOnS = st25[0], setAnimOnS = st25[1]
			var st36 = react.useState(pressChrome)
			var pressChromeS = st36[0], setPressChromeS = st36[1]
			var st26 = react.useState(stretchOn)
			var strOnS = st26[0], setStrOnS = st26[1]
			var st27 = react.useState(stretchK)
			var strKS = st27[0], setStrKS = st27[1]
			var st28 = react.useState(strSens)
			var sensS = st28[0], setSensS = st28[1]
			var st29 = react.useState(strMax)
			var maxS = st29[0], setMaxS = st29[1]
			var st30 = react.useState(strRate)
			var rateS = st30[0], setRateS = st30[1]
			var st31 = react.useState(Math.round(hlSat * 100))
			var hlsPct = st31[0], setHlsPct = st31[1]
			var st32 = react.useState(Math.round(hlBri * 100))
			var hlbPct = st32[0], setHlbPct = st32[1]
			var st33 = react.useState(Math.round(hlSize))
			var hlzPct = st33[0], setHlzPct = st33[1]
			var st35 = react.useState(Math.round(hlSoft))
			var hlfPct = st35[0], setHlfPct = st35[1]
			var st34 = react.useState(fpsDbg)
			var fpsOnS = st34[0], setFpsOnS = st34[1]

			function upStrTune(sens, max, rate) {
				strSens = sens; strMax = max; strRate = rate
				try {
					liqStore.set(STRSENS_KEY, String(sens))
					liqStore.set(STRMAX_KEY, String(max))
					liqStore.set(STRRATE_KEY, String(rate))
				} catch (e) {}
			}

			function groupTitle(t) {
				return react.createElement('div', { style: { fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', opacity: .55 } }, t)
			}

			function settingCard(title, items) {
				var dpr = (typeof window !== 'undefined' && window.devicePixelRatio) ? window.devicePixelRatio : 1
				if (!(dpr > 0)) dpr = 1
				var kids = [groupTitle(title)]
				for (var i = 0; i < items.length; i++) {
					if (!items[i]) continue
					kids.push(react.createElement('div', {
						'aria-hidden': 'true',
						style: {
							height: '1px',
							background: 'rgba(127,140,160,.28)',
							transform: 'scaleY(' + (1 / dpr) + ')',
							transformOrigin: 'center',
							flexShrink: 0,
							pointerEvents: 'none'
						}
					}))
					kids.push(items[i])
				}
				return react.createElement('div', {
					style: {
						background: 'rgba(127,140,160,.10)',
						border: '1px solid rgba(127,140,160,.18)',
						borderRadius: '14px',
						padding: '12px 14px 14px',
						display: 'flex',
						flexDirection: 'column',
						gap: '10px'
					}
				}, kids)
			}

			function switchRow(label, hint, onVal, onChange, dimmed) {
				return react.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', opacity: dimmed ? .35 : 1, pointerEvents: dimmed ? 'none' : 'auto' } },
					react.createElement('div', { style: { flex: '1' } },
						react.createElement('div', { style: { fontSize: '13px', fontWeight: '600' } }, label),
						react.createElement('div', { style: { fontSize: '12px', opacity: .65 } }, hint)
					),
					react.createElement(GlassSwitch, { on: onVal, onChange: onChange, disabled: !!dimmed })
				)
			}

			function sliderBlock(label, hint, minV, maxV, stepV, val, unit, onV, dimmed) {
				return react.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px', opacity: dimmed ? .35 : 1, pointerEvents: dimmed ? 'none' : 'auto' } },
					react.createElement('div', null,
						react.createElement('div', { style: { fontSize: '13px', fontWeight: '600' } }, label),
						hint ? react.createElement('div', { style: { fontSize: '12px', opacity: .65 } }, hint) : null
					),
					react.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '10px' } },
						react.createElement('div', { style: { flex: '1', minWidth: 0 } },
							react.createElement(GlassSlider, { min: minV, max: maxV, step: stepV, value: val, onChange: onV, disabled: !!dimmed })
						),
						react.createElement(GlassTicker, { text: unit, width: 44 })
					)
				)
			}
			var st22 = react.useState(satOn)
			var satOnS = st22[0], setSatOnS = st22[1]
			var st23 = react.useState(satVal)
			var satVS = st23[0], setSatVS = st23[1]

			function upMag(on, k) { setMagOnS(on); setMagKS(k); setMag(on, k) }
			function upRef(on, k) { setRefOnS(on); setRefKS(k); setRef(on, k) }
			function upSpec(on, m) { setSpecOnS(on); setSpecMS(m); setSpec(on, m) }
			function upSat(on, v) { setSatOnS(on); setSatVS(v); setSat(on, v) }

			function layerRow(label, on, mul, maxPct, doSet) {
				return react.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px' } },
					react.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '10px' } },
						react.createElement('div', { style: { flex: '1' } },
							react.createElement('div', { style: { fontSize: '13px', fontWeight: '600' } }, label),
							react.createElement('div', { style: { fontSize: '12px', opacity: .65 } }, liqT('100% 为 kube.io 原版默认', '100% matches the kube.io original'))
						),
						react.createElement(GlassSwitch, { on: on, onChange: function (next) { doSet(next, mul) } })
					),
					react.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', opacity: on ? 1 : .35, pointerEvents: on ? 'auto' : 'none' } },
						react.createElement('div', { style: { flex: '1', minWidth: 0 } },
							react.createElement(GlassSlider, {
								min: 0, max: maxPct, step: 1,
								value: Math.round(mul * 100),
								onChange: function (v) { doSet(on, v / 100) },
								disabled: !on
							})
						),
						react.createElement(GlassTicker, { text: Math.round(mul * 100) + '%', width: 38 })
					)
				)
			}
			return react.createElement('div', { className: 'liq-settings', style: { padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '16px' } },
				settingCard(liqT('液态玻璃各层', 'Glass layers'), [
					layerRow(liqT('放大层（长文透视增强）', 'Magnify layer'), magOnS, magKS, 200, upMag),
					layerRow(liqT('折射层（边缘弯折）', 'Refract layer'), refOnS, refKS, 200, upRef),
					layerRow(liqT('高光层（边沿光泽）', 'Specular layer'), specOnS, specMS, 300, upSpec),
				react.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px' } },
					react.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '10px' } },
						react.createElement('div', { style: { flex: '1' } },
							react.createElement('div', { style: { fontSize: '13px', fontWeight: '600' } }, liqT('色散层（边缘彩虹）', 'Dispersion layer')),
							react.createElement('div', { style: { fontSize: '12px', opacity: .65 } }, liqT('边缘色彩分离强度，1 为无色散，9 为默认', 'Edge color-split strength; 1 disables dispersion, 9 is the default'))
						),
						react.createElement(GlassSwitch, { on: satOnS, onChange: function (next) { upSat(next, satVS) } })
					),
					react.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', opacity: satOnS ? 1 : .35, pointerEvents: satOnS ? 'auto' : 'none' } },
						react.createElement('div', { style: { flex: '1', minWidth: 0 } },
							react.createElement(GlassSlider, {
								min: 1, max: 20, step: 1, value: satVS,
								onChange: function (v) { setSatVS(v); upSat(satOnS, v) },
								disabled: !satOnS
							})
						),
						react.createElement(GlassTicker, { text: (satOnS ? satVS : 1).toFixed(0), width: 38 })
					)
				)
				]),
				settingCard(liqT('点击动画', 'Click animation'), [
				switchRow(liqT('点击动画', 'Click animation'), liqT('按住/松开输入卡时的弹簧动画总开关', 'Master switch for the springy press-release animation'), animOnS, function (next) { setAnimOnS(next); setAnimOn(next) }),
				switchRow(liqT('控件也触发按压', 'Press on controls'), liqT('划选文字、点工具行和按钮时也播放弹簧。关掉则只有点在玻璃空白处才鼓。', 'Also play the press spring when selecting text or clicking the tool row and buttons. Off: only empty glass presses.'), !!(animOnS && pressChromeS), function (next) { setPressChromeS(next); setPressChrome(next) }, !animOnS),
				sliderBlock(liqT('动画速度', 'Animation speed'), liqT('整体播放速率，1 为与 kube.io 原版一致，越小越慢', 'Overall playback rate; 1 matches the kube.io original, lower is slower'), .35, 2, .01, spd, spd.toFixed(2) + 'x', function (v) { setSpd(v); timeScale = v; try { liqStore.set(SPEED_KEY, String(v)) } catch (err) {} }, !animOnS),
				sliderBlock(liqT('弹簧幅度', 'Spring amplitude'), liqT('按压时卡片弹开的距离，1 为与 kube.io 原版一致', 'How far the card pops out when pressed; 1 matches the kube.io original'), .3, 2, .01, amp, amp.toFixed(2) + 'x', function (v) { setAmp(v); amplitude = v; try { liqStore.set(AMP_KEY, String(v)) } catch (err) {}; if (pressed) spBase.t = pressTarget() }, !animOnS),
				switchRow(liqT('按住拖拽拉伸', 'Drag-stretch'), liqT('按住后移动鼠标，玻璃朝移动方向弹性拉伸', 'Move the mouse while holding to elastically stretch the glass toward the motion'), !!(animOnS && strOnS), function (next) { setStrOnS(next); setStretch(next, stretchK) }, !animOnS),
				sliderBlock(liqT('位移强度', 'Displacement'), liqT('鼠标位移转化为玻璃平移的程度', 'How much pointer movement shifts the glass'), 0, 100, 1, Math.round(strKS / .3 * 100), Math.round(strKS / .3 * 100) + '%', function (v) { setStrKS(v / 100 * .3); setStretch(strOnS, v / 100 * .3) }, !(animOnS && strOnS)),
				sliderBlock(liqT('方向灵敏度', 'Direction sensitivity'), liqT('鼠标偏移转化为鼓出意图的比例（横向基准，纵向约为其 86%）', 'How much pointer offset becomes bulge (horizontal basis; vertical is about 86% of it)'), .1, .8, .01, sensS, sensS.toFixed(2), function (v) { setSensS(v); upStrTune(v, strMax, strRate) }, !(animOnS && strOnS)),
				sliderBlock(liqT('最大拉伸距离', 'Max stretch'), liqT('边缘鼓出的像素上限', 'Pixel cap for edge bulge'), 20, 90, 1, maxS, maxS.toFixed(0) + 'px', function (v) { setMaxS(v); upStrTune(strSens, v, strRate) }, !(animOnS && strOnS)),
				sliderBlock(liqT('跟随速度', 'Follow speed'), liqT('形变跟随鼠标移动的响应速率，越大越跟手', 'How quickly the deformation follows the pointer; higher tracks tighter'), 3, 20, 1, rateS, rateS.toFixed(0), function (v) { setRateS(v); upStrTune(strSens, strMax, v) }, !(animOnS && strOnS))
				]),
				settingCard(liqT('点击高光', 'Click glow'), [
				switchRow(liqT('点击高光', 'Click glow'), liqT('按住输入卡时在指针位置直接提升玻璃背景像素的饱和度与亮度（不再叠加白色遮罩）', 'Directly boosts backdrop-pixel saturation and brightness at the pointer while pressing (no white overlay)'), on, function (next) { setOn(next); setHl(next) }),
				sliderBlock(liqT('点击饱和度', 'Click saturation'), liqT('按住时指针附近背景像素的饱和度倍率，100% 为不变', 'Backdrop saturation multiplier near the pointer while pressing; 100% = unchanged'), 100, 500, 1, hlsPct, hlsPct + '%', function (v) { setHlsPct(v); setHlSat(v / 100) }, !on),
				sliderBlock(liqT('点击亮度', 'Click brightness'), liqT('按住时指针附近背景像素的亮度倍率，100% 为不变', 'Backdrop brightness multiplier near the pointer while pressing; 100% = unchanged'), 100, 250, 1, hlbPct, hlbPct + '%', function (v) { setHlbPct(v); setHlBri(v / 100) }, !on),
				sliderBlock(liqT('高光范围', 'Glow size'), liqT('指针处增艳区域的半径，100% 约 130px', 'Radius of the boosted area at the pointer; 100% ≈ 130px'), 40, 300, 1, hlzPct, hlzPct + '%', function (v) { setHlzPct(v); setHlSize(v) }, !on),
				sliderBlock(liqT('光晕细腻度', 'Halo softness'), liqT('光晕边缘的柔和程度，小=凝聚锐利，大=柔和弥散', 'Softness of the halo edge; low = tight and sharp, high = soft and diffuse'), 0, 100, 1, hlfPct, hlfPct + '%', function (v) { setHlfPct(v); setHlSoft(v) }, !on)
				]),
				settingCard(liqT('磨砂模糊（亚克力）', 'Frost blur (acrylic)'), [
					switchRow(liqT('磨砂模糊', 'Frost blur'), liqT('在折射之上叠加毛玻璃雾面，类似 macOS 亚克力材质', 'Adds a frosted veil on top of the refraction, similar to macOS acrylic'), blurOnSt, function (next) { setBlurOnSt(next); setBlurOn(next) }),
					sliderBlock(liqT('强度', 'Strength'), liqT('雾面模糊半径', 'Frost blur radius'), 0, 8, .1, blurV, blurV.toFixed(1) + 'px', function (v) { setBlurV(v); setBlurVal(v) }, !blurOnSt),
					switchRow(liqT('液态玻璃色调', 'Glass tint'), liqT('给玻璃叠一层浅色或暗色底', 'Adds a light or dark wash over the glass'), tintOnS, function (next) { setTintOnS(next); setTintOn(next) }),
					react.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px', opacity: tintOnS ? 1 : .35, pointerEvents: tintOnS ? 'auto' : 'none' } },
						react.createElement('div', { style: { fontSize: '13px', fontWeight: '600' } }, liqT('着色倾向', 'Tint bias')),
						react.createElement('div', { style: { fontSize: '12px', opacity: .65 } }, liqT('浅色、暗色，或跟随 DSH 界面亮暗', 'Light, dark, or follow the DSH UI')),
						react.createElement(GlassSwitch, {
							value: mode,
							disabled: !tintOnS,
							onChange: function (m) { setMode(m); setAcrylicMode(m) },
							options: [
								{ value: 'light', label: liqT('浅色', 'Light') },
								{ value: 'dark', label: liqT('暗色', 'Dark') },
								{ value: 'system', label: liqT('跟随界面', 'UI') }
							]
						})
					),
					sliderBlock(liqT('着色强度', 'Tint strength'), liqT('色调不透明度', 'Tint opacity'), 0, .5, .01, tint, Math.round(tint * 100) + '%', function (v) { setTintSt(v); setTint(v) }, !tintOnS)
				]),
				settingCard(liqT('尺寸与布局', 'Size & layout'), [
					sliderBlock(liqT('输入卡宽度', 'Card width'), liqT('占可用宽度的百分比', 'Percentage of the available width'), 55, 100, 1, cw, cw.toFixed(0) + '%', function (v) { setCw(v); setCardSize(v, ch) }),
					react.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px' } },
						react.createElement('div', { style: { fontSize: '13px', fontWeight: '600' } }, liqT('输入卡高度', 'Card height')),
						react.createElement('div', { style: { fontSize: '12px', opacity: .65 } }, chMode === 'default' ? liqT('跟随内容（选固定或自适应后可用滑杆）', 'Follows content (pick Fixed or Auto to unlock the slider)') : (chMode === 'fixed' ? liqT('固定高度，长文在框内滚动', 'Fixed height; long text scrolls inside') : liqT('自适应：滑杆为最低高度，随文字行数自动长高', 'Auto: the slider sets a minimum; the card grows with text lines'))),
						react.createElement(GlassSwitch, {
							value: chMode,
							onChange: function (m) {
								setChMode(m)
								hMode = m
								try { liqStore.set(HMODE_KEY, m) } catch (err) {}
								setCardSize(cw, ch)
								try { hlVertAlign() } catch (err) {}
							},
							options: [
								{ value: 'default', label: liqT('默认', 'Default') },
								{ value: 'fixed', label: liqT('固定', 'Fixed') },
								{ value: 'grow', label: liqT('自适应', 'Auto') }
							]
						})
					),
					sliderBlock(liqT('高度', 'Height'), liqT('固定或自适应模式下的高度', 'Height in Fixed or Auto mode'), 50, 240, 1, ch, ch.toFixed(0) + 'px', function (v) {
						setCh(v)
						var m = chMode === 'default' ? 'fixed' : chMode
						setChMode(m)
						hMode = m
						cardH = v
						try { liqStore.set(CH_KEY, String(v)); liqStore.set(HMODE_KEY, m) } catch (err) {}
						applySize()
						try { hlVertAlign() } catch (err) {}
					}, chMode === 'default'),
					sliderBlock(liqT('上沿渐变', 'Top fade'), liqT('输入文字靠近卡片上沿时淡出的高度，0 为不淡', 'How far text fades near the top edge; 0 = no fade'), 0, 80, 1, fadeTopSt, fadeTopSt.toFixed(0) + 'px', function (v) { setFadeTopSt(v); fadeTop = v; try { liqStore.set(FADETOP_KEY, String(v)) } catch (err) {}; applyFade() }, chMode === 'default'),
					sliderBlock(liqT('下沿渐变', 'Bottom fade'), liqT('输入文字靠近卡片下沿、伸进工具行时淡出的高度，0 为不淡', 'How far text fades near the bottom edge and into the tool row; 0 = no fade'), 0, 80, 1, fadeBotSt, fadeBotSt.toFixed(0) + 'px', function (v) { setFadeBotSt(v); fadeBot = v; try { liqStore.set(FADEBOT_KEY, String(v)) } catch (err) {}; applyFade() }, chMode === 'default')
				]),
				settingCard(liqT('侧边按钮居中', 'Side-button centering'), [
					switchRow(liqT('侧边按钮居中', 'Side-button centering'), liqT('加号和发送按钮移到两侧垂直居中，输入文字居中显示且不被遮挡', 'Moves the plus and send buttons to the sides, centers the text and keeps it unobstructed'), sideOn, function (next) { setSideOn(next); setSideBtn(next) }),
					sliderBlock(liqT('下移偏置', 'Vertical nudge'), liqT('文字相对卡片中线的向下微调', 'Fine downward offset of the text relative to the card midline'), 0, 24, 1, nud, nud.toFixed(0) + 'px', function (v) { setNud(v); VERT_NUDGE = v; try { liqStore.set(NUDGE_KEY, String(v)) } catch (err) {}; applyNudge() }),
					sliderBlock(liqT('左右限位', 'Side padding'), liqT('输入文字距两侧按钮的安全距离', 'Safe distance between the text and the side buttons'), 20, 140, 1, ins, ins.toFixed(0) + 'px', function (v) { setIns(v); insetPx = v; try { liqStore.set(INSET_KEY, String(v)) } catch (err) {}; applyInset() }),
					sliderBlock(liqT('工具行内缩', 'Row inset'), liqT('访问模式、模型选单、上下文用量向内偏移的距离', 'Inset for the access mode, model picker and context meter'), 0, 80, 1, rin, rin.toFixed(0) + 'px', function (v) { setRin(v); rowInset = v; try { liqStore.set(ROWINSET_KEY, String(v)) } catch (err) {}; applyRowInset() }),
					sliderBlock(liqT('工具行上下偏移', 'Row vertical offset'), liqT('权限、模型选单相对卡片底边的位移，正值下移、负值上移', 'Shifts the access mode and model picker from the bottom edge; positive moves down, negative moves up'), -16, 20, 1, rowYSt, rowYSt.toFixed(0) + 'px', function (v) { setRowYSt(v); rowY = v; try { liqStore.set(ROWY_KEY, String(v)) } catch (err) {}; applyRowY() })
				]),
				settingCard(liqT('调试', 'Debug'), [
					switchRow(liqT('性能监视（FPS）', 'Performance monitor (FPS)'), liqT('右上角实时显示帧率，排查掉帧用；平时建议关', 'Live FPS badge at the top-right for debugging jank; keep it off normally'), fpsOnS, function (next) { setFpsOnS(next); setFpsDebug(next) })
				])
		)
	}

