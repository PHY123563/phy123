/**
 * 姓名：潘贺杨 | 学号：24002120316 | 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 功能：健康检查路由，挂载于 /api 前缀下
 */
const phyRouter = require('express').Router();
const { phyGetHealth } = require('../controllers/phy_health_controller');

// GET /api/phy_health 健康检查
phyRouter.get('/phy_health', phyGetHealth);

module.exports = phyRouter;
