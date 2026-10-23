---
name: web-design-project
description: 用于维护潘贺杨（24002120316）《高级网页设计》课堂实践项目。当用户在本项目中新增、修改或提交网页练习页面，或需要更新 index.html 课堂目录时使用本技能。
---

# 《高级网页设计》课堂实践项目

## 项目背景
- 作者：潘贺杨，学号 24002120316
- 主题：高级网页设计课堂实践目录（CLASS PRACTICE / 2026）
- 技术约束：仅使用原生 HTML / CSS / JavaScript，不使用 CDN，不引入任何第三方框架
- 提交说明：替换为需要提交的说明

## 目录结构
- `index.html` —— 课堂目录首页，收录所有练习页面的超链接，包含本次任务提示词
- `1.html` + `1.css` —— 练习 01：字体图标（SVG 图标 + Tab 导航 + 点击状态切换，iconfont 资源）
- `2.html` + `2.css` —— 练习 02：Flex 布局（导航布局、三等分布局、响应式卡片网格、侧边栏）
- `font/` —— 本地字体图标资源（iconfont.ttf / woff / woff2 / js / css / json / demo 页）

## 新增练习页面的工作流
1. 按练习序号创建页面文件，如 `3.html` 与 `3.css`，保持与目录一致的命名
2. 使用原生代码实现，内部引用的资源（图片、字体图标）优先使用 `font/` 本地资源
3. 页面完成后，更新 `index.html` 中的 `.catalog` 网格：新增一个 `.entry` 卡片，包含序号、标题、简述、入口链接及 `.entry-action`
4. 更新 `.catalog` 链接指向新页面，并同步“已完成模块 / N”计数
5. 保持页面风格与现有卡片视觉一致（珊瑚色、金色、青色点缀；Georgia + 微软雅黑字体栈）

## 提交与发布
- 仓库地址：https://gitee.com/neusoft_wangyao_jsj/123.git
- 提交目录：仓库下的 `24002120316潘贺杨/` 文件夹
- 提交流程：`git add -A` → `git commit`（说明本次新增/修改的练习）→ `git push origin master`
- 推送认证：使用 Gitee 私人令牌作为密码