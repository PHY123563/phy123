/**
 * 姓名：潘贺杨 | 学号：24002120316 | 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 功能：科技新闻路由，挂载于 /api 前缀下
 */
const phyRouter = require('express').Router();
const { phyGetNewsList } = require('../controllers/phy_news_controller');

// GET /api/phy_news 科技新闻列表
phyRouter.get('/phy_news', phyGetNewsList);

module.exports = phyRouter;
