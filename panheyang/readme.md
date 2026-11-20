# 星屿 · 个人网页作品集导航

高级网页设计课程综合作业。

- 姓名：潘贺杨
- 学号：24002120316

## 项目简介

以原生 HTML / CSS / JavaScript 实现的作品集导航首页：背景为 canvas 粒子连线动画，主体为已完成的 HTML 页面导航卡片；后端基于 Node.js + Express 提供 `/api/` 前缀的 RESTful 接口，并托管前端静态资源。

## 技术栈

- 前端：原生 HTML、CSS、JavaScript（禁止第三方库 / CDN）
- 后端：Node.js + Express（RESTful + MVC），端口 8316
- 数据库：MySQL（凭据存放于 `backend/.env`，不随仓库提交）

## 快速启动

```bash
# 后端
cd backend
npm i
npm start        # 服务地址：http://localhost:8316
```

浏览器访问 http://localhost:8316 即可打开首页。

## 目录结构

```
panheyang/
├── frontend/          # 前端静态资源（css/ js/ fonts/ images/）
├── backend/           # Express 后端（routes/ controllers/ config/）
├── AGENTS.md          # 项目开发规则
└── readme.md
```
