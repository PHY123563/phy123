/**
 * 姓名：潘贺杨 | 学号：24002120316 | 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 功能：AI 聊天页交互。把对话消息提交到后端 POST /api/phy_chat（SSE 流式），
 *       逐字渲染 AI 回复；支持多平台切换、图片识别（canvas 压缩后 base64 发送）、
 *       语音输入（Web Speech API 语音转文字）与语音播报（speechSynthesis 朗读回复）。
 */
(function () {
  // 接口地址固定为 8316 端口（绝对地址，双击打开页面也能请求数据）
  var PHY_API_URL = 'http://localhost:8316/api/phy_chat';
  var PHY_KEY_STORAGE = 'phy_siliconflow_api_key';

  // 页面元素集中管理
  var phyDom = {
    log: document.getElementById('phy_chat_log'),
    input: document.getElementById('phy_chat_input'),
    send: document.getElementById('phy_chat_send'),
    clear: document.getElementById('phy_chat_clear'),
    key: document.getElementById('phy_chat_key'),
    keySave: document.getElementById('phy_chat_key_save'),
    platform: document.getElementById('phy_chat_platform'),
    imgBtn: document.getElementById('phy_chat_imgbtn'),
    file: document.getElementById('phy_chat_file'),
    imgBar: document.getElementById('phy_chat_imgbar'),
    imgPreview: document.getElementById('phy_chat_img_preview'),
    imgRemove: document.getElementById('phy_chat_img_remove'),
    mic: document.getElementById('phy_chat_mic'),
    speak: document.getElementById('phy_chat_speak'),
    dot: document.getElementById('phy_chat_dot'),
    statusText: document.getElementById('phy_chat_status_text')
  };

  // 待发送图片状态（压缩后的 base64 dataURL）
  var phyImage = { dataUrl: '' };
  // 语音识别实例与录音状态（null 表示当前浏览器不支持）
  var phyRecognition = null;
  var phyListening = false;
  // 朗读开关状态
  var phySpeakOn = false;

  // 对话历史（system 提示词由后端统一拼接，这里只存 user/assistant）
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
    phyDom.statusText.textContent = phyMode === 'off' ? '未就绪' : phyMode === 'busy' ? '思考中…' : '已就绪';
  }

  // 功能：从 localStorage 读取密钥，有则回填输入框并更新状态
  function phyLoadKey() {
    var phySaved = localStorage.getItem(PHY_KEY_STORAGE);
    if (phySaved) {
      phyDom.key.value = phySaved;
      phySetStatus('ready');
    }
  }

  // 功能：校验并保存密钥到 localStorage，返回是否成功
  function phySaveKey() {
    var phyKey = phyDom.key.value.trim();
    if (phyKey && (!phyKey.startsWith('sk-') || phyKey.length < 20)) {
      phyAppendMsg('error', '密钥格式不正确：硅基流动的密钥以 sk- 开头。');
      return false;
    }
    localStorage.setItem(PHY_KEY_STORAGE, phyKey);
    phySetStatus('ready');
    return true;
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

  // 功能：请求后端聊天接口，流式渲染 AI 回复并维护对话历史（phyMsg 为完整消息对象）
  function phyChat(phyMsg) {
    phyHistory.push(phyMsg);
    phySetStatus('busy');
    phyDom.send.disabled = true;
    var phyAiNode = phyAppendMsg('ai', '');
    phyAiNode.classList.add('phy_chat_typing');

    fetch(PHY_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: phyHistory,
        apiKey: phyDom.key.value.trim(),
        platform: phyDom.platform.value
      })
    })
      .then(function (phyRes) {
        // 非流式 JSON 响应说明后端返回了统一错误格式
        var phyType = phyRes.headers.get('content-type') || '';
        if (phyType.indexOf('application/json') !== -1) {
          return phyRes.json().then(function (phyData) {
            console.log('聊天接口返回：', phyData);
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

    // 功能：流结束后恢复输入状态并写入历史（朗读开关打开时朗读回复）
    function phyFinish() {
      phyAiNode.classList.remove('phy_chat_typing');
      if (phyAiNode.textContent) {
        phyHistory.push({ role: 'assistant', content: phyAiNode.textContent });
        phySpeak(phyAiNode.textContent);
      }
      phySetStatus('ready');
      phyDom.send.disabled = false;
      phyDom.input.focus();
    }

    // 功能：请求失败时输出错误、弹出错误气泡并恢复输入
    function phyFail(phyErr) {
      console.error('请求聊天接口失败：', phyErr);
      phyAiNode.classList.remove('phy_chat_typing');
      phyAiNode.remove();
      phyHistory.pop();
      phyAppendMsg('error', '请求失败：' + phyErr.message);
      phySetStatus('off');
      phyDom.send.disabled = false;
    }
  }

  // 功能：读取用户选择的图片，用 canvas 压缩到最长边 1024px 后转 base64 并显示预览
  function phyPickImage(phyFile) {
    if (!phyFile || phyFile.type.indexOf('image/') !== 0) {
      phyAppendMsg('error', '请选择图片文件（jpg / png 等格式）。');
      return;
    }
    var phyReader = new FileReader();
    // 先读成临时 Image，再画到 canvas 上等比缩小，控制请求体体积
    phyReader.onload = function (phyE) {
      var phyImg = new Image();
      phyImg.onload = function () {
        // 视觉模型要求图片宽高大于 28 像素，太小直接友好报错
        if (phyImg.width < 28 || phyImg.height < 28) {
          phyAppendMsg('error', '图片太小（' + phyImg.width + '×' + phyImg.height + '）：视觉模型要求图片至少 28×28 像素，请换一张大一点的图。');
          return;
        }
        var phyMax = 1024;
        var phyScale = Math.min(1, phyMax / Math.max(phyImg.width, phyImg.height));
        var phyCanvas = document.createElement('canvas');
        phyCanvas.width = Math.round(phyImg.width * phyScale);
        phyCanvas.height = Math.round(phyImg.height * phyScale);
        phyCanvas.getContext('2d').drawImage(phyImg, 0, 0, phyCanvas.width, phyCanvas.height);
        phyImage.dataUrl = phyCanvas.toDataURL('image/jpeg', 0.85);
        phyDom.imgPreview.src = phyImage.dataUrl;
        phyDom.imgBar.hidden = false;
      };
      phyImg.src = phyE.target.result;
    };
    phyReader.readAsDataURL(phyFile);
  }

  // 功能：清空待发送图片并隐藏预览条
  function phyClearImage() {
    phyImage.dataUrl = '';
    phyDom.imgPreview.src = '';
    phyDom.imgBar.hidden = true;
    phyDom.file.value = '';
  }

  // 功能：切换麦克风按钮的录音中样式
  function phySetListening(phyOn) {
    phyListening = phyOn;
    phyDom.mic.classList.toggle('phy_chat_micbtn_listening', phyOn);
  }

  // 功能：初始化浏览器语音识别（Web Speech API），不支持时按钮点击给友好提示
  function phyInitRecognition() {
    var phyRecClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!phyRecClass) return null;
    var phyRec = new phyRecClass();
    phyRec.lang = 'zh-CN';
    phyRec.interimResults = true;
    phyRec.continuous = false;
    // 识别结果：把最终文本追加进输入框
    phyRec.onresult = function (phyE) {
      var phyText = '';
      for (var phyI = phyE.resultIndex; phyI < phyE.results.length; phyI++) {
        if (phyE.results[phyI].isFinal) phyText += phyE.results[phyI][0].transcript;
      }
      if (phyText) {
        phyDom.input.value = (phyDom.input.value + phyText).slice(0, 2000);
        phyAutoGrow();
        phyDom.input.focus();
      }
    };
    phyRec.onend = function () { phySetListening(false); };
    phyRec.onerror = function (phyE) {
      phySetListening(false);
      if (phyE.error === 'not-allowed' || phyE.error === 'service-not-allowed') {
        phyAppendMsg('error', '麦克风权限被拒绝：请在浏览器地址栏左侧允许麦克风后重试。');
      } else if (phyE.error !== 'aborted') {
        phyAppendMsg('error', '语音识别出错：' + phyE.error);
      }
    };
    return phyRec;
  }

  // 功能：点击 🎤 开始/停止语音识别
  function phyToggleMic() {
    if (!phyRecognition) {
      phyAppendMsg('error', '当前浏览器不支持语音识别，请使用 Edge 或 Chrome（localhost 环境下可用）。');
      return;
    }
    if (phyListening) {
      phyRecognition.stop();
      phySetListening(false);
      return;
    }
    try {
      phyRecognition.start();
      phySetListening(true);
      phyAppendMsg('ai', '🎤 正在聆听，请说话…（再次点击 🎤 结束）');
    } catch (phyErr) {
      // start 在已在录音时会抛异常，忽略即可
    }
  }

  // 功能：用浏览器语音合成朗读 AI 回复（开关打开时生效）
  function phySpeak(phyText) {
    if (!phySpeakOn || !window.speechSynthesis || !phyText) return;
    speechSynthesis.cancel();
    var phyUtter = new SpeechSynthesisUtterance(phyText);
    phyUtter.lang = 'zh-CN';
    phyUtter.rate = 1;
    speechSynthesis.speak(phyUtter);
  }

  // 功能：切换「朗读回复」开关
  function phyToggleSpeak() {
    phySpeakOn = !phySpeakOn;
    phyDom.speak.textContent = '朗读回复：' + (phySpeakOn ? '开' : '关');
    if (!phySpeakOn && window.speechSynthesis) speechSynthesis.cancel();
  }

  // 功能：把输入文字与待发送图片组装成消息对象（带图时用 OpenAI 兼容的 content 数组）
  function phyBuildUserMsg(phyText) {
    if (!phyImage.dataUrl) return { role: 'user', content: phyText };
    return {
      role: 'user',
      content: [
        { type: 'text', text: phyText },
        { type: 'image_url', image_url: { url: phyImage.dataUrl } }
      ]
    };
  }

  // 功能：读取输入框内容，非空或有图片则追加用户消息并发起对话
  function phySendCurrent() {
    var phyText = phyDom.input.value.trim();
    if ((!phyText && !phyImage.dataUrl) || phyDom.send.disabled) return;
    if (!phyText) phyText = '请描述这张图片的内容';
    // 渲染用户气泡：带图时先插缩略图再插文字，纯文本沿用旧结构
    var phyUserDiv = phyAppendMsg('user', phyImage.dataUrl ? '' : phyText);
    if (phyImage.dataUrl) {
      var phyImgEl = document.createElement('img');
      phyImgEl.className = 'phy_chat_msg_img';
      phyImgEl.src = phyImage.dataUrl;
      phyUserDiv.appendChild(phyImgEl);
      var phySpan = document.createElement('span');
      phySpan.textContent = phyText;
      phyUserDiv.appendChild(phySpan);
    }
    var phyMsg = phyBuildUserMsg(phyText);
    phyDom.input.value = '';
    phyDom.input.style.height = 'auto';
    phyClearImage();
    phyChat(phyMsg);
  }

  // 功能：清空消息列表与对话历史
  function phyClearChat() {
    phyHistory = [];
    phyDom.log.innerHTML = '';
    phyAppendMsg('ai', '对话已清空。想聊点什么？比如问我“flex 布局怎么让三个盒子等分”。');
  }

  // 功能：根据输入内容自动调整输入框高度（最多约五行）
  function phyAutoGrow() {
    phyDom.input.style.height = 'auto';
    phyDom.input.style.height = Math.min(phyDom.input.scrollHeight, 140) + 'px';
  }

  // 初始化：加载密钥、放欢迎语、绑定事件
  phyLoadKey();
  phyAppendMsg('ai', '你好，我是 AI 助教。若后端 .env 已配置密钥可直接提问，否则请先在下方保存硅基流动 API Key。');
  phyDom.send.addEventListener('click', phySendCurrent);
  phyDom.clear.addEventListener('click', phyClearChat);
  phyDom.keySave.addEventListener('click', phySaveKey);
  phyDom.imgBtn.addEventListener('click', function () { phyDom.file.click(); });
  // 选好文件后压缩并显示预览；可随时点「移除图片」撤销
  phyDom.file.addEventListener('change', function (phyE) {
    if (phyE.target.files && phyE.target.files[0]) phyPickImage(phyE.target.files[0]);
  });
  phyDom.imgRemove.addEventListener('click', phyClearImage);
  // 语音：初始化识别实例并绑定 🎤 与朗读开关
  phyRecognition = phyInitRecognition();
  phyDom.mic.addEventListener('click', phyToggleMic);
  phyDom.speak.addEventListener('click', phyToggleSpeak);
  phyDom.key.addEventListener('keydown', function (phyE) {
    if (phyE.key === 'Enter') phySaveKey();
  });
  phyDom.input.addEventListener('input', phyAutoGrow);
  phyDom.input.addEventListener('keydown', function (phyE) {
    // Enter 直接发送，Shift+Enter 保留换行
    if (phyE.key === 'Enter' && !phyE.shiftKey) {
      phyE.preventDefault();
      phySendCurrent();
    }
  });
})();
