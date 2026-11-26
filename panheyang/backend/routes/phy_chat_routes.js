/**
 * 姓名：潘贺杨 | 学号：24002120316 | 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 功能：AI 聊天路由，挂载于 /api 前缀下
 */
const phyRouter = require('express').Router();
const { phyPostChat } = require('../controllers/phy_chat_controller');

// POST /api/phy_chat AI 聊天（流式响应）
phyRouter.post('/phy_chat', phyPostChat);

module.exports = phyRouter;
