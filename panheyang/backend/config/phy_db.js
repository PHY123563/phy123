/**
 * 姓名：潘贺杨 | 学号：24002120316 | 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 功能：MySQL 连接池。凭据读取自 backend/.env（DB_USER / DB_PASSWORD / DB_HOST / DB_NAME）
 */
const phyMysql = require('mysql2/promise');

const phyPool = phyMysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'phy_web',
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = phyPool;
