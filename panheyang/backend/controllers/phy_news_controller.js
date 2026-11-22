/**
 * 姓名：潘贺杨 | 学号：24002120316 | 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 功能：科技新闻控制器。提供新闻列表查询，返回统一 JSON 响应格式。
 */
const { phyFindAllNews } = require('../models/phy_news_model');

// GET /api/phy_news 新闻列表
const phyGetNewsList = async (phyReq, phyRes) => {
  try {
    const phyList = await phyFindAllNews();
    phyRes.json({
      code: 0,
      msg: '新闻列表查询成功',
      data: {
        count: phyList.length,
        list: phyList
      }
    });
  } catch (phyErr) {
    console.error('新闻列表查询失败：', phyErr.message);
    phyRes.json({ code: 1, msg: '新闻列表查询失败：' + phyErr.message, data: null });
  }
};

module.exports = { phyGetNewsList };
