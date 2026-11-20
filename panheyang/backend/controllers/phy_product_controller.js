/**
 * 姓名：潘贺杨 | 学号：24002120316 | 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 功能：产品图文控制器。提供产品列表查询，返回统一 JSON 响应格式。
 */
const { phyFindAllProducts } = require('../models/phy_product_model');

// GET /api/phy_products 产品图文列表
const phyGetProductList = async (phyReq, phyRes) => {
  try {
    const phyList = await phyFindAllProducts();
    phyRes.json({
      code: 0,
      msg: '产品列表查询成功',
      data: {
        count: phyList.length,
        list: phyList
      }
    });
  } catch (phyErr) {
    console.error('产品列表查询失败：', phyErr.message);
    phyRes.json({ code: 1, msg: '产品列表查询失败：' + phyErr.message, data: null });
  }
};

module.exports = { phyGetProductList };
