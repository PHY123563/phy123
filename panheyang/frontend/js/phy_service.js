/**
 * 姓名：潘贺杨 | 学号：24002120316 | 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 功能：在线客服页交互。与 AI 聊天页共用同一个后端接口 POST /api/phy_chat（SSE 流式），
 *       仅在请求体里多传 system 字段把人设换成店铺客服；密钥由后端 .env 提供。
 */
(function () {
  // 接口地址固定为 8316 端口（绝对地址，双击打开页面也能请求数据）
  var PHY_API_URL = 'http://localhost:8316/api/phy_chat';

  // 客服人设：只回答营业时间、招牌菜、配送范围三类问题，其余礼貌引导留言。
  // 写法要点：先用角色句划定身份，再逐条给出三类问题的「标准答案」，最后写明越界话术——
  // 模型只会照着这三类回答，范围外的内容一律走到引导留言的分支，从而被「管住」。
  var PHY_SYSTEM_PROMPT = '你是「中华美食街」网店的在线客服，回答保持简洁友好，使用中文。你只回答三类问题：'
    + '1) 营业时间：周一至周日 10:30–21:30，节假日照常营业，每日 14:30–17:00 为茶歇时段只接外带；'
    + '2) 招牌菜：宫保鸡丁、北京烤鸭、麻婆豆腐、蟹黄小笼包和酸梅汤是招牌，每周一上新菜；'
    + '3) 配送范围：门店周边 5 公里内约 30 分钟送达，5–10 公里约 45 分钟送达，超过 10 公里暂不支持配送。'
    + '遇到这三类之外的问题，请礼貌说明已超出客服解答范围，并引导用户留言（留下联系方式与问题描述，营业时间内会尽快回复）。';

  // 页面元素集中管理
  var phyDom = {
    log: document.getElementById('phy_chat_log'),
    input: document.getElementById('phy_chat_input'),
    send: document.getElementById('phy_chat_send'),
    clear: document.getElementById('phy_chat_clear'),
    dot: document.getElementById('phy_chat_dot'),
    statusText: document.getElementById('phy_chat_status_text')
  };

  // 对话历史（system 人设随请求体发送，这里只存 user/assistant）
  var phyHistory = [];

  // 功能：在消息列表末尾追加一条消息节点，返回该节点供流式更新
  function phyAppendMsg(phyRole, phyText) {
    var phyDiv = document.createElement('div');
    phyDiv.className = phyRole === 'user' ? 'phy_chat_msg phy_chat_msg_user'
      : phyRole === 'error' ? 'phy_chat_msg phy_chat_msg_error'
      : 'phy_chat_msg phy_chat_msg_ai';
    phyDiv.textContent = phyText;
    phyDom.log.appendChild(phyDiv);
    phyDom.log.scrollTop = phyDom.log.scrollHeight;
    return phyDiv;
  }

  // 功能：更新顶部状态圆点与文字（ready / busy / off）
  function phySetStatus(phyMode) {
    phyDom.dot.className = 'phy_chat_dot' + (phyMode === 'off' ? ' phy_chat_dot_off'
      : phyMode === 'busy' ? ' phy_chat_dot_busy' : '');
    phyDom.statusText.textContent = phyMode === 'off' ? '未就绪' : phyMode === 'busy' ? '输入中…' : '客服在线';
  }

  // 功能：解析一行 SSE 数据，把 AI 增量文本追加到指定节点
  function phyHandleStreamLine(phyLine, phyNode) {
    if (!phyLine.startsWith('data:')) return;
    var phyPayload = phyLine.slice(5).trim();
    if (phyPayload === '[DONE]') return;
    try {
      var phyJson = JSON.parse(phyPayload);
      var phyDelta = phyJson.choices && phyJson.choices[0] && phyJson.choices[0].delta;
      if (phyDelta && phyDelta.content) {
        phyNode.textContent += phyDelta.content;
        phyDom.log.scrollTop = phyDom.log.scrollHeight;
      }
    } catch (phyErr) {
      // 忽略无法解析的注释行
    }
  }

  // 功能：请求后端聊天接口（附带客服人设），流式渲染回复并维护对话历史
  function phyChat(phyUserText) {
    phyHistory.push({ role: 'user', content: phyUserText });
    phySetStatus('busy');
    phyDom.send.disabled = true;
    var phyAiNode = phyAppendMsg('ai', '');
    phyAiNode.classList.add('phy_chat_typing');

    fetch(PHY_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: phyHistory,
        system: PHY_SYSTEM_PROMPT
      })
    })
      .then(function (phyRes) {
        // 非流式 JSON 响应说明后端返回了统一错误格式
        var phyType = phyRes.headers.get('content-type') || '';
        if (phyType.indexOf('application/json') !== -1) {
          return phyRes.json().then(function (phyData) {
            console.log('客服接口返回：', phyData);
            throw new Error(phyData.msg || '后端返回未知错误');
          });
        }
        return phyRes;
      })
      .then(function (phyRes) {
        var phyReader = phyRes.body.getReader();
        var phyDecoder = new TextDecoder();
        var phyBuffer = '';
        // 逐块读取 SSE 流，按行解析并渲染
        function phyPump() {
          phyRes.body && phyReader.read().then(function (phyChunk) {
            if (phyChunk.done) {
              phyFinish();
              return;
            }
            phyBuffer += phyDecoder.decode(phyChunk.value, { stream: true });
            var phyLines = phyBuffer.split('\n');
            phyBuffer = phyLines.pop();
            for (var i = 0; i < phyLines.length; i++) {
              phyHandleStreamLine(phyLines[i].trim(), phyAiNode);
            }
            phyPump();
          }).catch(phyFail);
        }
        phyPump();
      })
      .catch(phyFail);

    // 功能：流结束后恢复输入状态并写入历史
    function phyFinish() {
      phyAiNode.classList.remove('phy_chat_typing');
      if (phyAiNode.textContent) {
        phyHistory.push({ role: 'assistant', content: phyAiNode.textContent });
      }
      phySetStatus('ready');
      phyDom.send.disabled = false;
      phyDom.input.focus();
    }

    // 功能：请求失败时输出错误、弹出错误气泡并恢复输入
    function phyFail(phyErr) {
      console.error('请求客服接口失败：', phyErr);
      phyAiNode.classList.remove('phy_chat_typing');
      phyAiNode.remove();
      phyHistory.pop();
      phyAppendMsg('error', '请求失败：' + phyErr.message);
      phySetStatus('off');
      phyDom.send.disabled = false;
    }
  }

  // 功能：读取输入框内容，非空则追加用户消息并发起对话
  function phySendCurrent() {
    var phyText = phyDom.input.value.trim();
    if (!phyText || phyDom.send.disabled) return;
    phyAppendMsg('user', phyText);
    phyDom.input.value = '';
    phyDom.input.style.height = 'auto';
    phyChat(phyText);
  }

  // 功能：清空消息列表与对话历史
  function phyClearChat() {
    phyHistory = [];
    phyDom.log.innerHTML = '';
    phyAppendMsg('ai', '会话已清空。您可以继续咨询营业时间、招牌菜或配送范围。');
  }

  // 功能：根据输入内容自动调整输入框高度（最多约五行）
  function phyAutoGrow() {
    phyDom.input.style.height = 'auto';
    phyDom.input.style.height = Math.min(phyDom.input.scrollHeight, 140) + 'px';
  }

  // 初始化：提示服务范围、绑定事件
  phySetStatus('ready');
  phyAppendMsg('ai', '您好，这里是「中华美食街」在线客服。我可以为您解答营业时间、招牌菜、配送范围三类问题，其他问题请留言，我们会尽快回复～');
  phyDom.send.addEventListener('click', phySendCurrent);
  phyDom.clear.addEventListener('click', phyClearChat);
  phyDom.input.addEventListener('input', phyAutoGrow);
  phyDom.input.addEventListener('keydown', function (phyE) {
    // Enter 直接发送，Shift+Enter 保留换行
    if (phyE.key === 'Enter' && !phyE.shiftKey) {
      phyE.preventDefault();
      phySendCurrent();
    }
  });
})();
