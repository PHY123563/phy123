/**
 * 姓名：潘贺杨 | 学号：24002120316 | 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 功能：数据库连接测试路由，挂载于 /api 前缀下
 */
const phyRouter = require('express').Router();
const { phyConnectDb } = require('../controllers/phy_db_controller');

// POST /api/phy_db_connect 测试 MySQL 连接
phyRouter.post('/phy_db_connect', phyConnectDb);

module.exports = phyRouter;
