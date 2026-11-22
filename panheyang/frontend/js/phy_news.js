/**
 * 姓名：潘贺杨 | 学号：24002120316 | 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 功能：科技新闻列表页交互。请求 GET /api/phy_news 渲染新闻列表，
 *       服务器返回数据与错误信息均输出到浏览器控制台（console.log / console.error）。
 */
(function () {
  // 接口地址固定为 8316 端口（绝对地址，双击打开页面也能请求数据）
  var PHY_API_URL = 'http://localhost:8316/api/phy_news';

  var phyListBox = document.getElementById('phy_news_list');
  var phyCountBox = document.getElementById('phy_news_count');

  // 渲染新闻条目
  function phyRenderNews(phyList) {
    var phyHtml = '';
    for (var i = 0; i < phyList.length; i++) {
      var phyItem = phyList[i];
      phyHtml += '<article class="phy_news_item">' +
        '<div class="phy_news_title_row">' +
          '<h2 class="phy_news_title">' + phyItem.phy_title + '</h2>' +
          '<span class="phy_news_category">' + phyItem.phy_category + '</span>' +
        '</div>' +
        '<p class="phy_news_summary">' + phyItem.phy_summary + '</p>' +
        '<div class="phy_news_meta">' +
          '<span>来源：' + phyItem.phy_source + '</span>' +
          '<span>发布：' + phyItem.phy_published_at + '</span>' +
        '</div>' +
      '</article>';
    }
    phyListBox.innerHTML = phyHtml;
    phyCountBox.textContent = '共 ' + phyList.length + ' 条';
  }

  // 显示加载失败提示（红色卡片）
  function phyRenderError(phyMsg) {
    phyListBox.innerHTML = '<div class="phy_news_error">✘ ' + phyMsg + '</div>';
    phyCountBox.textContent = '';
  }

  // 请求新闻数据
  fetch(PHY_API_URL)
    .then(function (phyRes) { return phyRes.json(); })
    .then(function (phyData) {
      // 按约定把服务器返回数据输出到控制台
      console.log('新闻列表接口返回：', phyData);
      if (phyData.code === 0 && phyData.data && phyData.data.list.length > 0) {
        phyRenderNews(phyData.data.list);
      } else {
        phyRenderError(phyData.msg || '暂无新闻数据');
      }
    })
    .catch(function (phyErr) {
      // 按约定把错误信息输出到控制台
      console.error('请求新闻列表接口失败：', phyErr);
      phyRenderError('加载新闻失败：' + phyErr.message);
    });
})();
