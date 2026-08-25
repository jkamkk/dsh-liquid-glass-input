# dsh-liquid-glass-input

> [!WARNING]
> **⚠️ 仅支持 Chromium 内核浏览器（Chrome / Edge 等）/ Chromium-based browsers only**
>
> 折射效果依赖 SVG 位移滤镜：Firefox、Safari 下看不到折射与放大，其余功能不受影响。
> Refraction relies on SVG displacement filters: in Firefox and Safari the glass renders without refraction or magnification — everything else works.

## 效果预览 / Preview

![演示动画](assets/demo.webp)

| 浅色模式效果 | 暗色模式效果 |
| --- | --- |
| ![浅色效果](assets/preview-light.png)<br>浅色 Light | ![暗色效果](assets/preview-dark.png)<br>暗色 Dark |

> 动图为录屏压缩版，实际效果以实机为准。
> The clip above is a compressed screen recording; the live effect looks better.

给 DSH Web GUI 输入卡加 kube.io「Magnifying Glass」液态玻璃折射效果：
Adds a kube.io "Magnifying Glass" liquid-glass refraction effect to the input card of the DSH Web GUI:

- 官方位移图/高光图/放大图，端头等比缩放贴合四角，中段平铺补线；Canvas 预合成，滤镜内约 11 原语
- Official displacement / specular / magnifying maps, corners scaled to fit, edges tiled; maps are pre-composited on canvas, about eleven filter primitives in total
- 按压动画：原版 9 弹簧系统逐参数复刻（rAF 积分，transform/阴影/滤镜缩放全耦合）
- Press animation faithfully rebuilt from the original nine-spring system (rAF-integrated, with transform, shadow and filter scale all coupled)
- 点击处柔和高光（设置里可关）、动画速度滑杆（设置里可调）
- Soft glow at the click point (can be turned off) and an animation-speed slider, both in settings
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

**按压 Press**——按下卡片时它向外微微鼓起、阴影随之收拢，松手沿弹簧曲线荡两下回到原位；点击的位置会同时泛开一小片柔光，不想要可以在设置里关掉。
**Press** — pressing gently bulges the card outward while its shadow pulls in; on release it settles back with a springy wobble. A soft glow also blooms at the exact spot you clicked, which can be switched off in settings.

**按住拖动 Drag-stretch**——按住不放再移动，玻璃会先跟着手走一小段，像被拽着的软胶体；同时顺着移动方向被拉长、垂直方向被压扁，速度越快形变越明显。松手后位移和形状一起弹回原状。「跟着手走」的距离和「拉伸」的幅度各有滑杆可调。
**Drag-stretch** — hold and move: the glass trails your pointer for a short distance like pulled soft jelly, stretching along the motion and squashing sideways; the faster you move, the stronger the deformation. On release, position and shape spring back together. Trail distance and stretch amount each have their own slider.

## 性能与开销 / Performance

静止时插件不做逐帧工作：弹簧循环只在按压、拖拽和回弹过程中运行，参数落定后自动停止。
At rest the plugin does no per-frame work: the spring loop runs only during press, drag and settle-back, and stops itself once the values converge.

三张映射图在启动时用 Canvas 合成一次，之后整个折射效果驻留在一个常驻 SVG 滤镜里——动画过程只改滤镜的一个数值，不重建滤镜拓扑。
The three maps are composited once on a canvas at startup; refraction then lives inside one persistent SVG filter, and animation only rewrites a single filter value instead of rebuilding anything.

主要开销有三处，都与卡片面积成正比。若在低性能设备上感到卡顿，可优先关闭磨砂模糊，其次逐层关掉放大/折射：
There are three main costs, each scaling with card area. If the card feels laggy on weaker hardware, switch off frost blur first, then the magnify/refract layers one by one:

- 磨砂模糊——backdrop-filter 高斯模糊，最贵的一层
- Frost blur — a backdrop-filter gaussian, by far the heaviest layer
- 折射与放大——边缘的位移图采样
- Refraction & magnify — displacement-map sampling along the edges
- 按压/拖动期间的 transform 与阴影刷新——requestAnimationFrame 驱动，仅交互期间存在
- Transform & shadow refreshes while pressing or dragging — requestAnimationFrame-driven, interaction-only

折射边缘的细微锯齿来自 SVG 位移滤镜的逐像素采样机制，是该技术的固有限制（原版演示同样存在），开启磨砂模糊可明显缓解；实测关闭放大层后锯齿只剩边缘折射处的一点残迹，对锯齿敏感也可将放大层一并关闭。
The fine stair-stepping along refracted edges comes from the per-pixel sampling of SVG displacement filters and is inherent to the technique (the original demo shows it too); enabling frost blur masks it considerably; with the magnify layer switched off only a faint trace remains at the edges.

## 安装 / Install

```
dsh plugin add github:jkamkk/dsh-liquid-glass-input
```

本地开发调试可从目录安装：
For local development you can install from a directory instead:

```
dsh plugin --profile web add <本目录>
```

安装后重启 DSH Web GUI 生效。设置界面按浏览器语言自动切换中文/英文；所有设置保存在 DSH 主机目录（~/.dsh）下，换浏览器无需重调。
Restart the DSH Web GUI afterwards. The settings panel switches between Chinese and English automatically based on browser language; settings are stored on the DSH host (~/.dsh), so they survive browser switches.

位移图来源：https://kube.io/blog/liquid-glass-css-svg （版权归原作者，仅限个人学习使用）
Displacement maps come from https://kube.io/blog/liquid-glass-css-svg (all rights with the original author; for personal study only).

## 关于 WebGL 路线的尝试

v1.18 曾试验用 WebGL 着色器替代 SVG 滤镜来消除锯齿（v1.19 已移除）。放弃原因：浏览器没有提供读取元素身后真实像素的 API——backdrop-filter 能拿到背景是浏览器的特权行为，WebGL 只能看到你自己上传的纹理，等于要自己重画整个背景，成本不可接受。
In v1.18 a WebGL shader path was tried to remove the jaggies (removed in v1.19). It was abandoned because browsers provide no way to read the real pixels behind an element: backdrop-filter gets the backdrop as a browser privilege, while WebGL only sees textures you supply yourself, so the entire background would have to be redrawn manually.
