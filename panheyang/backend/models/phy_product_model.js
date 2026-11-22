/**
 * 姓名：潘贺杨 | 学号：24002120316 | 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 功能：产品图文数据模型。查询 phy_product 表，按上架时间倒序返回全部产品。
 */
const phyPool = require('../config/phy_db');

// 查询全部产品（按上架时间倒序）
const phyFindAllProducts = async () => {
  const [phyRows] = await phyPool.query(
    'SELECT phy_id, phy_name, phy_category, phy_price, phy_desc, phy_image, phy_created_at FROM phy_product ORDER BY phy_id ASC'
  );
  return phyRows;
};

module.exports = { phyFindAllProducts };
