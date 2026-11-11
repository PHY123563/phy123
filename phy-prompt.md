# Swiper 课堂任务 · 四轮提示词记录

> 本文档记录了从课堂任务发布到最终完成的四轮 AI 协作提示词，每一轮对应一次需求升级 / Bug 修复。
> 可以作为 Swiper 从零到进阶的**学习路线图**。

---

## 📌 第一轮 · 基础任务：Cube 3D 方块轮播

> 目标：实现一个可以直接在浏览器运行的 Swiper 轮播页面，要求 cube 效果、自动播放、手动停止、分页器可点。

### 提示词原文

```
请帮我写一个基于 Swiper 插件的轮播图 HTML 和 JS 代码。我的具体配置要求如下：

1. 需要实现无缝循环播放（loop: true）。
2. 需要配置自动播放，每 3.2 秒自动翻页（autoplay）。
3. 关键要求：手动操作（滑动或点击）后，自动播放需要停止（即设置 pauseOnMouseEnter 或相关交互逻辑），不要再继续自动播。
4. 底部的圆点分页器需要支持点击切换（pagination，clickable: true）。
5. 轮播图的初始效果（effect）设置为 cube（3D 方块效果）。

请给我一份完整的、可以直接在浏览器运行的代码（包含引入 Swiper 的 CDN 链接、HTML 结构、CSS 和初始化 JS），并加上清晰的中文注释。
```

### 核心收获
- `loop: true` + `autoplay.delay: 3200` + `pagination.clickable: true` + `effect: 'cube'` 是最基础的组合
- Swiper 官方 CDN 用 `swiper-bundle.min.css` + `swiper-bundle.min.js`，一键包含所有模块

---

## 📌 第二轮 · Bug 修复：手动停止 + Cube 3D 立体感

> 目标：第一轮代码跑起来发现两个问题——① 手动拖拽后自动播放没停；② Cube 看起来扁平没有 3D 感。

### 提示词原文

```
我发现你在初始化配置里虽然写了 autoplay: { delay: 3200 }，但是没有实现"手动操作后自动播放停止"的功能。请告诉我应该怎么修改代码（是加 stopOnLastSlide 还是监听 touchStart 事件？），请把修改后的完整 JS 代码发给我。

2. 你的 cube（3D方块）效果在页面里看起来是扁平的，没有 3D 的感觉。请检查一下你的代码，是不是少写了关于 swiper-cube 的 CSS 类名，或者少引入了对应的 CSS 文件？请帮我补全这部分样式。
```

### Bug 根因 + 修复方案

| 问题 | 根因 | 修复 |
|------|------|------|
| 手动后自动播**不停** | `disableOnInteraction: true` 只对 wrapper 内部拖拽有效，**点击分页器圆点不算** | **两层保险**：① `disableOnInteraction: true`（内置）② 显式监听 `touchStart` / `pointerDown` / `slideClick` / 点圆点 → 全部调 `autoplay.stop()` |
| Cube **扁平** | 自己 CSS 里写了 `overflow: hidden`，把 3D 旋转到容器外的立方体面**全裁掉了** | ① `overflow: visible` ② `.swiper { perspective: 1200px }` ③ `.swiper-cube .swiper-wrapper { transform-style: preserve-3d }` 兜底 |

### 关键代码对照
```js
// ❌ 错误：设成 false 了
autoplay: { disableOnInteraction: false }
// ✅ 正确
autoplay: { disableOnInteraction: true, pauseOnMouseEnter: false }
```

```css
/* ❌ 错误：把 3D 面裁掉了 */
.swiper { overflow: hidden; }
/* ✅ 正确 */
.swiper { overflow: visible; perspective: 1200px; }
.swiper-cube .swiper-wrapper { transform-style: preserve-3d; }
```

---

## 📌 第三轮 · 进阶自学：Creative 创意变换

> 目标：课堂没讲的 Swiper 第 7 种 effect——creative（自定义 transform），需要自己参考官方文档 + AI 协作学会。

### 提示词原文

```
我正在学习 Swiper 插件。课堂上老师只讲了 6 种 effect 效果，但我发现 Swiper 官方文档里还有一种叫 creative（创意定义变换） 的效果没有讲。

请帮我参考 Swiper 官方示例（参考链接/路径：swiper/demo/257-effect-creative.html），帮我写一段包含 creativeEffect 的 transform 写法的初始化代码。

具体需求如下：

1. 代码需要包含 prev 和 next 两个方向的 transform 配置。
2. 上一张（prev）：要求实现缩小、左移，并带有轻微的角度旋转。
3. 下一张（next）：要求实现放大、右移进场（参数由你自定义，但要有电影感，比如带一点景深或者透明度变化）。
4. 请结合代码，用通俗的语言详细解释一下 transform 里面的 translate、rotate、scale、opacity 等属性分别控制什么？ 比如改了哪个数值会让卡片移动变快，改哪个数值会让旋转角度变大？
```

### transform 四属性速查

| 属性 | 格式 | 通俗解释 | 改数值会怎样 |
|------|------|----------|-------------|
| `translate` | `[X, Y, Z]` | 三维位移。X 水平（+右/-左）、Y 垂直（+下/-上）、**Z 景深**（越小越远） | X 绝对值越大卡片移动越远；Z 越负越"缩到背景里"形成景深 |
| `scale` | `0~1.5` | 整体缩放。1 = 原大，0.5 = 一半 | 改小让 prev 退远时"越退越小"；设 1.2 让 next 从放大态冲进来 |
| `rotate` | `[X, Y, Z]` | 三轴旋转（角度）。creative 常用 Z 轴（平面旋转） | Z 正 → 顺时针转；Z 负 → 逆时针转；**数值越大旋转角度越大** |
| `opacity` | `0~1` | 透明度。0 = 全透明 | 改小让 prev 退场时淡出 |

### 电影选片墙默认配方
```js
creativeEffect: {
  prev: { translate: ['-60%',0,-400], scale: 0.75, rotate: [0,0,-12], opacity: 0.4 },
  next: { translate: ['60%',0,-200],  scale: 0.85, rotate: [0,0, 10], opacity: 0.7 }
}
```

---

## 📌 第四轮 · 综合创作：发光光影展 + 超纲 API

> 目标：做一个带炫酷发光效果的"爱达·魔都号"专属展示台，同时挑战两个课堂没讲过的 Swiper API。

### 提示词原文

```
我现在要在网页上做一个"光影展"的展品介绍轮播图。请你帮我写一段 HTML + CSS + Swiper JS 代码 放在网页底部

页面需求：

1. 轮播图宽度占满屏幕，比例 16:9。
2. 展品名称叫"爱达·魔都号"（首艘国产大型邮轮），图片背景我会自己替换。
3. 重点： 请给轮播图的卡片加上炫酷的发光效果（光效添加）。请用 CSS 的 box-shadow、filter: drop-shadow 或者渐变色边框来实现。
4. Swiper 基础配置：开启循环（loop），底部圆点分页，带上一张/下一张切换。
5. 超纲 API 挑战：请帮我加上 键盘控制（Keyboard Control） 和 鼠标滚轮控制（Mousewheel） 功能。请告诉我需要引入什么模块，以及 keyboard 和 mousewheel 的配置项该怎么写，才能让用户按方向键或滚动鼠标滚轮时切换幻灯片。
```

### 发光效果三层叠加

```
层 ① 外发光边框    ← .swiper::before 伪元素 + box-shadow 4 层叠加 + 呼吸动画
层 ② 卡片立体感    ← .swiper-slide { box-shadow }
层 ③ 图片贴合发光  ← img { filter: drop-shadow + saturate + contrast }
```

### 超纲 API 速查（无需额外引入模块！）

```js
// swiper-bundle.min.js 已内置 Keyboard / Mousewheel

keyboard: {
  enabled: true,          // 开启 ← → 方向键翻页
  pageUpDown: false        // 关掉 PageUp/PageDown 避免和浏览器冲突
},

mousewheel: {
  enabled: true,
  forceToAxis: true,       // ⭐ 强制横向翻页（忽略纵向滚动）
  releaseOnEdges: true,    // ⭐ 到首尾释放滚轮给页面正常滚动
  invert: false            // false=向下滚→下一张（自然方向）
}
```

---

## 📚 学习路线图（四轮提示词总览）

```
第 1 轮 · 基础配置        → loop + autoplay + pagination + cube
第 2 轮 · 常见坑修复      → disableOnInteraction 两层保险 + overflow:visible + perspective
第 3 轮 · effect 扩展     → creativeEffect.prev/next + transform 四属性
第 4 轮 · 综合创作       → CSS 发光三层叠加 + keyboard + mousewheel
```

> 每一轮都是"先写 → 跑起来 → 发现问题 → 修复 → 升级需求"的 AI 协作完整闭环。
