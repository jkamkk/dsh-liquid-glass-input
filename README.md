# dsh-liquid-glass-input

给 DSH Web GUI 输入卡加 kube.io「Magnifying Glass」液态玻璃折射效果：

- 官方位移图/高光图/放大图，端头等比缩放贴合四角，中段平铺补线；Canvas 预合成，滤镜内约 11 原语
- 按压动画：原版 9 弹簧系统逐参数复刻（rAF 积分，transform/阴影/滤镜 scale 全耦合）
- 点击处柔和高光（设置里可关）、动画速度滑杆（设置里可调）
- 仅 Chromium 系浏览器可见折射

## 效果预览

![演示动画](assets/demo.webp)

| 浅色模式效果 | 暗色模式效果 |
| --- | --- |
| ![浅色效果](assets/preview-light.png) | ![暗色效果](assets/preview-dark.png) |

> 折射效果仅 Chromium 系浏览器可见；动图为录屏压缩版，实际效果以实机为准。

## 玻璃的层次

常见的「液态玻璃」皮肤只是把背景糊掉一层：透过卡片什么都看不真切，边缘也没有任何变化。这里把玻璃拆成了四个层次，各有各的观感：

| 层 | 观感 |
| --- | --- |
| 放大 | 贴近边缘的背景被微微放大，像隔着玻璃加厚的棱边看东西 |
| 折射 | 直线走到卡片边缘会弯一下、收一下，如同光线穿过有厚度的玻璃改了方向 |
| 高光 | 棱线上有一道随按压流动的亮边 |
| 磨砂 | 底下垫着一层雾面，托住上面三层，浓淡可调 |

普通磨砂是把背景「糊掉」，这里是想让背景「穿过」一块有厚度的玻璃。四层都能在设置里单独开关、调强弱、一键回到默认。

## 安装

```
dsh plugin add github:jkamkk/dsh-liquid-glass-input
```

本地开发调试可从目录安装：

```
dsh plugin --profile web add <本目录>
```

安装后重启 DSH Web GUI 生效。

位移图来源：https://kube.io/blog/liquid-glass-css-svg （版权归原作者，仅限个人学习使用）
