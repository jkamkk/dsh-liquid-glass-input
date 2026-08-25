# dsh-liquid-glass-input

给 DSH Web GUI 输入卡加 kube.io「Magnifying Glass」液态玻璃折射效果：

- 官方位移图/高光图/放大图，端头等比缩放贴合四角，中段平铺补线
- 性能版：拼图在卡片尺寸变化时用 Canvas 预合成一次，滤镜内只剩约 11 个原语
- 点击 Q 弹（CSS :active + 过冲回弹），无拖拽
- 仅 Chromium 系浏览器可见折射

安装：`dsh plugin --profile web add <本目录>`，然后重启 web。

位移图来源：https://kube.io/blog/liquid-glass-css-svg （版权归原作者，仅限个人学习使用）
