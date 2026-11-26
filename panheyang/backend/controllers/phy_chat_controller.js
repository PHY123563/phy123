/**
 * 姓名：潘贺杨 | 学号：24002120316 | 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 功能：AI 聊天 / 在线客服控制器。代理 OpenAI 兼容的 Chat Completions 接口，以 SSE 流式
 *       把回复转发给前端。支持多平台热切换：前端传 platform 字段即可在七牛 / 硅基流动之间
 *       切换，各平台的 baseURL、模型、密钥都配置在 backend/.env（Key 不下发到前端）。
 *       支持图片识别：消息 content 为数组且含 image_url 时自动改用该平台的视觉模型，
 *       所选平台没有可用视觉模型则自动回落到硅基流动的 Qwen3-VL。
 *       前端可传 system 字段覆盖默认人设（AI 聊天不传即用默认，在线客服传店铺客服人设）。
 */

// 多平台配置表（OpenAI 兼容；换/加平台只需改 .env 配置并在表里加一项，其余代码不动）
// visionModel 为该平台的视觉模型，留空表示该平台暂无可用视觉模型（七牛的 VL 系列已全部下线）
const PHY_PLATFORMS = {
  qiniu: {
    name: '七牛',
    url: (process.env.QINIU_BASE_URL || 'https://api.qnaigc.com/v1').replace(/\/+$/, '') + '/chat/completions',
    model: process.env.QINIU_MODEL || 'qiniu/conatus-free',
    visionModel: process.env.QINIU_VISION_MODEL || '',
    apiKey: process.env.QINIU_API_KEY || ''
  },
  siliconflow: {
    name: '硅基流动',
    url: (process.env.SILICONFLOW_BASE_URL || 'https://api.siliconflow.cn/v1').replace(/\/+$/, '') + '/chat/completions',
    model: process.env.SILICONFLOW_MODEL || 'deepseek-ai/DeepSeek-V4-Flash',
    visionModel: process.env.SILICONFLOW_VISION_MODEL || 'Qwen/Qwen3-VL-8B-Instruct',
    apiKey: process.env.SILICONFLOW_API_KEY || ''
  }
};
const PHY_SYSTEM_PROMPT = '你是《高级网页设计》课堂的 AI 助教，回答保持简洁友好，使用中文。';

// POST /api/phy_chat AI 聊天（流式响应，支持 platform 热切换与图片识别）
const phyPostChat = async (phyReq, phyRes) => {
  const phyBody = phyReq.body || {};
  const phyMessages = Array.isArray(phyBody.messages) ? phyBody.messages : [];
  // 平台热切换：前端传 platform（qiniu / siliconflow），不传或传错默认用七牛
  const phyPlatformKey = (typeof phyBody.platform === 'string' && PHY_PLATFORMS[phyBody.platform]) ? phyBody.platform : 'qiniu';
  let phyPlatform = PHY_PLATFORMS[phyPlatformKey];
  // 图片识别：消息 content 是数组且含 image_url 时改用视觉模型；当前平台没有则回落到硅基流动
  const phyHasImage = phyMessages.some(function (phyMsg) {
    return Array.isArray(phyMsg.content) && phyMsg.content.some(function (phyPart) {
      return phyPart && phyPart.type === 'image_url';
    });
  });
  let phyModel = phyPlatform.model;
  if (phyHasImage) {
    if (!phyPlatform.visionModel && PHY_PLATFORMS.siliconflow.visionModel) phyPlatform = PHY_PLATFORMS.siliconflow;
    if (phyPlatform.visionModel) phyModel = phyPlatform.visionModel;
  }
  // 密钥优先级：.env > 页面输入（页面 localStorage 里可能残留别的平台的 Key，后端配置更可靠）
  const phyApiKey = phyPlatform.apiKey || (typeof phyBody.apiKey === 'string' && phyBody.apiKey.trim()) || '';
  // 人设：客服页传自己的 system 提示词，AI 聊天页不传则用默认助教人设
  const phySystem = (typeof phyBody.system === 'string' && phyBody.system.trim()) || PHY_SYSTEM_PROMPT;

  // 入参校验：必须有至少一条用户消息
  if (phyMessages.length === 0) {
    return phyRes.json({ code: 1, msg: '缺少 messages 参数（至少一条用户消息）', data: null });
  }
  // 密钥校验：请求体与 .env 都没有提供
  if (!phyApiKey) {
    return phyRes.json({ code: 1, msg: '平台「' + phyPlatform.name + '」未配置密钥：请在 backend/.env 里配置 ' + phyPlatformKey.toUpperCase() + '_API_KEY，或在页面填写 API Key', data: null });
  }

  try {
    const phyResp = await fetch(phyPlatform.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + phyApiKey
      },
      body: JSON.stringify({
        model: phyModel,
        messages: [
          { role: 'system', content: phySystem },
          ...phyMessages.slice(-20)
        ],
        stream: true,
        max_tokens: 1024,
        temperature: 0.7
      })
    });

    // 上游返回错误（密钥无效、限流等）时，尽量带出上游的真实提示，方便在页面上直接排错
    if (!phyResp.ok) {
      const phyErrText = await phyResp.text();
      console.error('大模型接口返回错误：', phyResp.status, phyErrText.slice(0, 200));
      let phyDetail = '';
      try {
        const phyErrJson = JSON.parse(phyErrText);
        phyDetail = phyErrJson.error && phyErrJson.error.message || phyErrJson.message || '';
      } catch (phyErr) { /* 上游返回的不是 JSON 就不带详情 */ }
      return phyRes.json({
        code: 1,
        msg: '大模型接口返回 HTTP ' + phyResp.status + (phyDetail ? '：' + phyDetail.slice(0, 150) : '，请检查 baseURL、模型名与密钥是否有效'),
        data: null
      });
    }

    // 以 SSE 形式把上游流原样转发给前端
    phyRes.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    const phyReader = phyResp.body.getReader();
    const phyDecoder = new TextDecoder();
    // 循环读取上游数据块并转发，直到流结束
    while (true) {
      const { done, value } = await phyReader.read();
      if (done) break;
      phyRes.write(phyDecoder.decode(value, { stream: true }));
    }
    phyRes.end();
  } catch (phyErr) {
    console.error('AI 聊天请求失败：', phyErr.message);
    // 若响应头已发出则无法再改写 JSON，只能直接结束连接
    if (!phyRes.headersSent) {
      phyRes.json({ code: 1, msg: 'AI 聊天请求失败：' + phyErr.message, data: null });
    } else {
      phyRes.end();
    }
  }
};

module.exports = { phyPostChat };
