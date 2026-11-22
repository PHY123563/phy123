/**
 * 姓名：潘贺杨 | 学号：24002120316 | 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 功能：后端服务入口。托管 frontend/ 静态资源，挂载 /api/ 前缀路由，端口 8316
 */
require('dotenv').config();
const phyPath = require('path');
const phyExpress = require('express');
const phyCors = require('cors');

const phyApp = phyExpress();
const phyPort = Number(process.env.SERVER_PORT) || 8316;

// 开放全部跨域（仅课程作业使用）与 JSON 请求解析
phyApp.use(phyCors());
phyApp.use(phyExpress.json());

// 托管前端静态资源目录
phyApp.use(phyExpress.static(phyPath.join(__dirname, '..', 'frontend')));

// 挂载 /api 路由（RESTful + MVC）
phyApp.use('/api', require('./routes/phy_health_routes'));
phyApp.use('/api', require('./routes/phy_db_routes'));
phyApp.use('/api', require('./routes/phy_news_routes'));
phyApp.use('/api', require('./routes/phy_product_routes'));

// 404 兜底：统一 JSON 响应格式
phyApp.use((phyReq, phyRes) => {
  phyRes.status(404).json({ code: 404, msg: '接口不存在', data: null });
});

// 启动服务
phyApp.listen(phyPort, () => {
  console.log(`phy 后端服务已启动：http://localhost:${phyPort}`);
});
