---
name: frontend-design
description: 艺术品牌风格的前端页面设计规范。当需要为《高级网页设计》课程创作具有艺术品牌气质的网页（字体图标、矢量图形、排版展示、作品集页面）时使用本技能，统一视觉语言、命名规范与交互基调。
---

# frontend-design · 艺术品牌网页设计技能

## 品牌基调
- 关键词：画廊策展感 / 编辑排版 / 手工质感
- 命名规范（项目强制）：所有 CSS 类名、id 名、JS 变量以 `phy_` 前缀
- 每个新建 HTML 页面必须包含返回首页 `index.html` 的入口链接

## 色彩系统
| 变量 | 值 | 用途 |
| --- | --- | --- |
| `--phy-paper` | `#f5f1e8` | 页面底色（暖纸白） |
| `--phy-white` | `#fffdf8` | 卡片底色 |
| `--phy-ink` | `#17202a` | 主文字（墨色） |
| `--phy-muted` | `#66737d` | 弱化文字 |
| `--phy-coral` | `#ef6f61` | 品牌主色（珊瑚） |
| `--phy-gold` | `#f5c451` | 点缀（鎏金） |
| `--phy-teal` | `#2c8c88` | 辅助（青碧） |
| `--phy-line` | `rgba(23,32,42,.14)` | 细分隔线 |

## 字体栈
- 展示标题：`Georgia, "Times New Roman", serif`（衬线编辑感）
- 正文与界面：`"Microsoft YaHei", sans-serif`
- 中英双语字标使用 `letter-spacing: .08em` 以上拉开字距

## 版式语言
1. 顶部 brand bar：圆点 mark（珊瑚圆点 + 金色偏移阴影 `box-shadow: 9px 5px 0`）+ 中英双语字标 + 右侧首页入口链接
2. Hero 区：超大衬线标题 + 侧栏说明卡；背景叠两层径向渐变光晕（金、青各一处，透明度 ≤ .25）
3. 展示区：卡片网格 —— 白底、1px 墨色细线边框、12~18px 圆角、柔和投影
4. 角落装饰：金色/青色色块以 box-shadow 偏移错位，呼应 mark-dot
5. 页脚：细分隔线 + 弱化版权行（姓名 + 学号）

## 交互基调
- 悬浮：`translateY(-4px)` + 阴影加深，`transition: .25s ease`
- 图标演示页必须"可玩"：字号滑杆 / 描边滑杆 / 名称搜索过滤等轻交互
- 原生 JavaScript 增强，自定义变量一律 `phy_` 前缀

## 技术约束
- 原生 HTML / CSS / JavaScript，不使用第三方框架
- 第三方图标库以"本地化 CDN"方式引入：下载到项目根目录 `cdn/`，用相对路径引用，禁止运行时外网请求
- 字体图标（Font Awesome）走 `@font-face` + class 复用；SVG 图标（Lucide）走内联 SVG 注入（`data-lucide` + `createIcons()`）
