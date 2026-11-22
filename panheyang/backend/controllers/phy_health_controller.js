/**
 * 姓名：潘贺杨 | 学号：24002120316 | 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 功能：健康检查控制器，返回统一 JSON 响应格式
 */
const phyGetHealth = (phyReq, phyRes) => {
  phyRes.json({
    code: 0,
    msg: '服务运行正常',
    data: {
      time: new Date().toLocaleString('zh-CN'),
      author: '潘贺杨 24002120316'
    }
  });
};

module.exports = { phyGetHealth };
