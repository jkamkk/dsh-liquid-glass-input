# dsh-liquid-glass-input

[![dsh.so risk](https://www.dsh.so/badge/dsh-liquid-glass-input.svg)](https://www.dsh.so/artifact/dsh-liquid-glass-input/)
[![dsh.so install](https://www.dsh.so/badge/install/dsh-liquid-glass-input.svg)](https://www.dsh.so/artifact/dsh-liquid-glass-input/)

> [!WARNING]
> **仅支持 Chromium 内核浏览器（Chrome / Edge 等）/ Chromium-based browsers only**
>
> 折射效果依赖 SVG 位移滤镜：Firefox、Safari 下看不到折射与放大，其余功能不受影响。
> Refraction relies on SVG displacement filters: in Firefox and Safari the glass renders without refraction or magnification — everything else works.

## 效果预览 / Preview

![输入卡演示](assets/demo-input.webp)

> 动图为录屏压缩版，实际效果以实机为准。动图中的动态壁纸并非本插件效果，本插件只改变输入卡样式。
> The clip is a compressed recording; the live effect looks better. The animated wallpaper in the clip is not part of this plugin — it only restyles the input card.

![设置页演示](assets/demo-settings.webp)

| 浅色模式效果 | 暗色模式效果 |
| --- | --- |
| ![浅色效果](assets/preview-light.png)<br>浅色 Light | ![暗色效果](assets/preview-dark.png)<br>暗色 Dark |

<img src="assets/preview-settings.png" width="420" alt="设置页">

> 设置页可分组调节各层强度与点击动画，滑杆本身也是玻璃质感。
> The settings panel groups per-layer strength and press-animation controls; the sliders themselves use the same glass look.

给 DSH Web GUI 输入卡加 kube.io「Magnifying Glass」液态玻璃折射效果：
Adds a kube.io "Magnifying Glass" liquid-glass refraction effect to the input card of the DSH Web GUI:

- 官方位移图/高光图/放大图，端头等比缩放贴合四角，中段平铺补线；Canvas 预合成，滤镜内约 11 原语
- Official displacement / specular / magnifying maps, corners scaled to fit, edges tiled; maps are pre-composited on canvas, about eleven filter primitives in total
- 按压动画：原版 9 弹簧系统逐参数复刻（rAF 积分，transform/阴影/滤镜缩放全耦合）
- Press animation faithfully rebuilt from the original nine-spring system (rAF-integrated, with transform, shadow and filter scale all coupled)
- 点击像素增艳：按住时在指针位置直接提升玻璃背景像素的饱和度/亮度（径向蒙版限定区域，不叠白色遮罩；设置里可关，强度与范围滑杆可调）、动画速度滑杆（设置里可调）
- Click pixel boost: while pressing, the backdrop pixels' saturation/brightness are boosted directly at the pointer via a radial mask inside the SVG filter (no white overlay; switchable in settings with strength and size sliders) plus an animation-speed slider
- 仅 Chromium 系浏览器可见折射
- Refraction is visible only in Chromium-based browsers

## 玻璃的层次 / Layers of the glass

常见的「液态玻璃」皮肤只是把背景糊掉一层：透过卡片什么都看不真切，边缘也没有任何变化。这里把玻璃拆成了五个层次，各有各的观感：
Most so-called "liquid glass" skins simply blur whatever sits behind the card: everything behind turns into mush and the edge does nothing optical. Here the glass is split into five layers, each with its own look:

| 层 Layer | 观感 What you see |
| --- | --- |
| 放大 Magnify | 贴近边缘的背景被微微放大，像隔着玻璃加厚的棱边看东西<br>The background right inside the rim is slightly magnified, as if seen through the thickened edge of real glass |
| 折射 Refract | 直线走到卡片边缘会弯一下、收一下，如同光线穿过有厚度的玻璃改了方向<br>Straight lines bend and pinch inward as they reach the card's edge, the way light changes direction passing through thick glass |
| 高光 Specular | 棱线上有一道随按压流动的亮边<br>A bright rim along the edges that shifts while you press |
| 磨砂 Frost | 底下垫着一层雾面，托住上面三层，浓淡可调<br>A frosted veil underneath that carries the other layers; its strength is adjustable |
| 色散 Dispersion | 折射时红、绿、蓝三个颜色通道的偏移量略有差别，棱边上留下一线细细的彩虹边（色差）<br>The three color channels refract by slightly different amounts, leaving a thin rainbow fringe along the edge (chromatic aberration) |

普通磨砂是把背景「糊掉」，这里是想让背景「穿过」一块有厚度的玻璃。各层都能在设置里单独开关、调强弱、一键回到默认。
Ordinary frost just smears the background; this tries to let it pass through a piece of glass that has actual thickness. Every layer can be toggled, tuned or reset to default separately in the settings.

## 两种动画 / Two animations

**按压 Press**——按下卡片时它向外微微鼓起、阴影随之收拢，松手沿弹簧曲线荡两下回到原位；指针附近透过玻璃看到的景色会变浓、变亮，不想要可以在设置里关掉。
**Press** — pressing gently bulges the card outward while its shadow pulls in; on release it settles back with a springy wobble. The view through the glass grows richer and brighter around the pointer, which can be switched off in settings.

**按住拖动 Drag-stretch**——按住不放再移动，玻璃会先跟着手走一小段，像被拽着的软胶体；同时顺着移动方向被拉长、垂直方向被压扁，速度越快形变越明显。松手后位移和形状一起弹回原状。「跟着手走」的距离和「拉伸」的幅度各有滑杆可调。
**Drag-stretch** — hold and move: the glass trails your pointer for a short distance like pulled soft jelly, stretching along the motion and squashing sideways; the faster you move, the stronger the deformation. On release, position and shape spring back together. Trail distance and stretch amount each have their own slider.

## 性能与开销 / Performance

这套效果很吃性能，电脑弱一点就会卡。觉得卡，先关磨砂，再关放大和折射。
This effect is heavy. On a weaker machine it will stutter. If it does, switch off frost first, then magnify and refract.

所以只做输入卡，不做整套主题——侧栏、消息列表那些大地方一铺，只会更卡。
That is why this is only the input card, not a full theme: spreading the same glass over the sidebar or the message list would hitch even more.

## 安装 / Install

```
dsh plugin --profile web add dsh-liquid-glass-input
```

GitHub：

```
dsh plugin --profile web add github:jkamkk/dsh-liquid-glass-input
```

本地开发调试可从目录安装：
For local development you can install from a directory instead:

```
dsh plugin --profile web add <本目录>
```

安装后重启 DSH Web GUI 生效。设置界面按浏览器语言自动切换中文/英文；所有设置保存在 DSH 主机目录（~/.dsh）下，换浏览器无需重调。
Restart the DSH Web GUI afterwards. The settings panel switches between Chinese and English automatically based on browser language; settings are stored on the DSH host (~/.dsh), so they survive browser switches.

## 1.32.5

新安装的默认观感对齐作者当前这套：高度 70 固定、上下渐变 36px、下移偏置 0、左右限位 36、工具行下移 8、点击范围 200%、细腻度 100。性能监视默认仍关。
Fresh installs use the author's current look: 70px fixed height, 36px top/bottom fade, nudge 0, side inset 36, tool-row offset 8, click-glow size 200% and softness 100. The FPS badge stays off by default.

## 1.32.4

矮卡不再切掉输入文字。权限/模型那一行浮在卡片上，加号和发送仍在两侧中线。长文伸进工具行时上下渐变淡出（范围可调），换行时当前行钉在卡片中线（固定和自适应都是）。工具行可上下微调；侧边按钮那一组的滑杆关掉开关也能拖。
A short card no longer clips the input text. The access-mode / model row floats on the card; plus and send stay on the vertical midline. Long text fades at the top and bottom instead of running under the tools (fade range is adjustable). The line you are typing stays on the card midline when it wraps, in both Fixed and Auto height. The tool row can be nudged up or down; the sliders under side-button centering stay editable when that switch is off.

位移图来源：https://kube.io/blog/liquid-glass-css-svg （版权归原作者，仅限个人学习使用）
Displacement maps come from https://kube.io/blog/liquid-glass-css-svg (all rights with the original author; for personal study only).
