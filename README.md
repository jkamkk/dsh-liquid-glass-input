# dsh-liquid-glass-input

给 DSH Web GUI 输入卡加 kube.io「Magnifying Glass」液态玻璃折射效果：

- 官方位移图/高光图/放大图，端头等比缩放贴合四角，中段平铺补线；Canvas 预合成，滤镜内约 11 原语
- 按压动画：原版 9 弹簧系统逐参数复刻（rAF 积分，transform/阴影/滤镜 scale 全耦合）
- 点击处柔和高光（设置里可关）、动画速度滑杆（设置里可调）
- 仅 Chromium 系浏览器可见折射

## 效果预览

![演示动画](assets/demo.webp)

| 浅色壁纸 | 暗色壁纸 |
| --- | --- |
| ![浅色](assets/preview-light.png) | ![暗色](assets/preview-dark.png) |

> 折射效果仅 Chromium 系浏览器可见；动图为录屏压缩版，实际效果以实机为准。

## 安装

一键安装：

```
dsh plugin add https://github.com/jkamkk/dsh-liquid-glass-input
```

```
dsh plugin add https://github.com/jkamkk/dsh-liquid-glass-input
```

安装后重启 DSH Web GUI 生效。

位移图来源：https://kube.io/blog/liquid-glass-css-svg （版权归原作者，仅限个人学习使用）
