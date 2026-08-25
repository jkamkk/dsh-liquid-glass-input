# dsh-liquid-glass-input

给 DSH Web GUI 输入卡加 kube.io「Magnifying Glass」液态玻璃折射效果：

- 官方位移图/高光图/放大图，端头等比缩放贴合四角，中段平铺补线；Canvas 预合成，滤镜内约 11 原语
- 按压动画：原版 9 弹簧系统逐参数复刻（rAF 积分，transform/阴影/滤镜 scale 全耦合）
- 点击处柔和高光（设置里可关）、动画速度滑杆（设置里可调）
- 仅 Chromium 系浏览器可见折射

安装：`dsh plugin --profile web add <本目录>`，然后重启 web。

位移图来源：https://kube.io/blog/liquid-glass-css-svg （版权归原作者，仅限个人学习使用）
