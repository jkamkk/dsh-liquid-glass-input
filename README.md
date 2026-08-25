# dsh-liquid-glass-input

给 DSH Web GUI 输入卡加 kube.io「Magnifying Glass」液态玻璃折射效果：

- 官方位移图/高光图/放大图，端头等比缩放贴合四角，中段平铺补线
- Canvas 预合成拼图（尺寸变化才算一次），滤镜内约 11 个原语，滚动/打字流畅
- 点击 Q 弹：rAF 物理弹簧实时积分，多段回弹；点击处柔光高亮（设置里可关）
- 仅 Chromium 系浏览器可见折射

安装：`dsh plugin --profile web add <本目录>`，然后重启 web。

位移图来源：https://kube.io/blog/liquid-glass-css-svg （版权归原作者，仅限个人学习使用）
