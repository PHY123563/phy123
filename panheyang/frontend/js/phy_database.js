/**
 * 姓名：潘贺杨 | 学号：24002120316 | 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 功能：数据库连接测试页交互。提交用户名/密码到 /api/phy_db_connect，
 *       成功显示绿色提示、失败显示红色提示，所有服务器返回与错误输出到浏览器控制台。
 */
(function () {
  var phyForm = document.getElementById('phy_db_form');
  var phyUserInput = document.getElementById('phy_db_user');
  var phyPassInput = document.getElementById('phy_db_pass');
  var phySubmitBtn = document.getElementById('phy_db_submit');
  var phyResultBox = document.getElementById('phy_db_result');

  // 在页面提示区显示结果：isSuccess 为 true 显示绿色成功样式，否则红色错误样式
  function phyShowResult(phyIsSuccess, phyText) {
    phyResultBox.hidden = false;
    phyResultBox.textContent = phyText;
    phyResultBox.className = 'phy_db_result ' + (phyIsSuccess ? 'phy_db_result_ok' : 'phy_db_result_err');
  }

  // 表单提交：请求后端连接测试接口
  phyForm.addEventListener('submit', function (phyEvent) {
    phyEvent.preventDefault();

    var phyUsername = phyUserInput.value.trim();
    var phyPassword = phyPassInput.value;
    if (!phyUsername || !phyPassword) {
      phyShowResult(false, '请先填写用户名和密码');
      return;
    }

    phySubmitBtn.disabled = true;
    phySubmitBtn.textContent = '正在连接…';

    fetch('http://localhost:8316/api/phy_db_connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: phyUsername, password: phyPassword })
    })
      .then(function (phyRes) { return phyRes.json(); })
      .then(function (phyData) {
        // 按约定把服务器返回数据输出到控制台
        console.log('数据库连接接口返回：', phyData);
        if (phyData.code === 0) {
          phyShowResult(true, '✔ ' + phyData.msg +
            '（版本：' + phyData.data.version +
            '，主机：' + phyData.data.host +
            '，用户：' + phyData.data.user + '）');
        } else {
          phyShowResult(false, '✘ ' + phyData.msg);
        }
      })
      .catch(function (phyErr) {
        // 按约定把错误信息输出到控制台
        console.error('请求数据库连接接口失败：', phyErr);
        phyShowResult(false, '✘ 请求异常：' + phyErr.message);
      })
      .finally(function () {
        phySubmitBtn.disabled = false;
        phySubmitBtn.textContent = '连 接 数 据 库';
      });
  });
})();
