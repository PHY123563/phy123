/**
 * 姓名：潘贺杨 | 学号：24002120316 | 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 功能：产品图文路由，挂载于 /api 前缀下
 */
const phyRouter = require('express').Router();
const { phyGetProductList } = require('../controllers/phy_product_controller');

// GET /api/phy_products 产品图文列表
phyRouter.get('/phy_products', phyGetProductList);

module.exports = phyRouter;
