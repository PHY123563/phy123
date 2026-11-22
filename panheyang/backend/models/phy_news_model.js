/**
 * 姓名：潘贺杨 | 学号：24002120316 | 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 功能：科技新闻数据模型。查询 phy_news 表，按发布时间倒序返回全部新闻。
 */
const phyPool = require('../config/phy_db');

// 查询全部科技新闻（按发布时间倒序）
const phyFindAllNews = async () => {
  const [phyRows] = await phyPool.query(
    'SELECT phy_id, phy_title, phy_category, phy_source, phy_summary, phy_published_at FROM phy_news ORDER BY phy_published_at DESC'
  );
  return phyRows;
};

module.exports = { phyFindAllNews };
