/**
 * 姓名：潘贺杨 | 学号：24002120316 | 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 功能：数据库连接测试控制器。接收前端提交的用户名/密码，尝试连接 MySQL 并返回统一 JSON 格式结果。
 */
const phyMysql = require('mysql2/promise');

// 常见连接错误码转中文提示
const PHY_ERROR_MAP = {
  ER_ACCESS_DENIED_ERROR: '用户名或密码错误，访问被拒绝',
  ECONNREFUSED: '无法连接到 MySQL 服务，请确认本机 MySQL 已启动',
  ETIMEDOUT: '连接超时，请检查 MySQL 主机地址',
  ER_NOT_SUPPORTED_AUTH_MODE: 'MySQL 认证插件不受支持，请使用 mysql_native_password 用户'
};

const phyConnectDb = async (phyReq, phyRes) => {
  const phyUsername = phyReq.body.username;
  const phyPassword = phyReq.body.password;

  // 参数校验：系统边界处验证用户输入
  if (!phyUsername || phyPassword === undefined || phyPassword === null) {
    return phyRes.json({ code: 1, msg: '用户名和密码不能为空', data: null });
  }

  try {
    // 使用页面提交的凭据建立连接（主机读取自 backend/.env 的 DB_HOST）
    const phyConn = await phyMysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: 3306,
      user: phyUsername,
      password: phyPassword,
      connectTimeout: 5000
    });

    const [phyRows] = await phyConn.query('SELECT VERSION() AS phy_version');
    await phyConn.end();

    phyRes.json({
      code: 0,
      msg: 'MySQL 连接成功',
      data: {
        version: phyRows[0].phy_version,
        host: process.env.DB_HOST || 'localhost',
        user: phyUsername,
        time: new Date().toLocaleString('zh-CN')
      }
    });
  } catch (phyErr) {
    // 按错误码翻译为中文提示，保留原始信息
    const phyReason = PHY_ERROR_MAP[phyErr.code] || phyErr.message;
    phyRes.json({ code: 1, msg: 'MySQL 连接失败：' + phyReason, data: null });
  }
};

module.exports = { phyConnectDb };
