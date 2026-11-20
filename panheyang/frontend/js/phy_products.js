/**
 * 姓名：潘贺杨 | 学号：24002120316 | 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 功能：产品图文列表页交互。请求 GET /api/phy_products 渲染图文卡片，
 *       服务器返回数据与错误信息均输出到浏览器控制台（console.log / console.error）。
 */
(function () {
  // 接口地址固定为 8316 端口（绝对地址，双击打开页面也能请求数据）
  var PHY_API_URL = 'http://localhost:8316/api/phy_products';

  var phyGridBox = document.getElementById('phy_products_grid');
  var phyCountBox = document.getElementById('phy_products_count');

  // 渲染产品图文卡片
  function phyRenderProducts(phyList) {
    var phyHtml = '';
    for (var i = 0; i < phyList.length; i++) {
      var phyItem = phyList[i];
      phyHtml += '<article class="phy_product_card">' +
        '<img class="phy_product_img" src="' + phyItem.phy_image + '" alt="' + phyItem.phy_name + '">' +
        '<div class="phy_product_body">' +
          '<div class="phy_product_title_row">' +
            '<h2 class="phy_product_name">' + phyItem.phy_name + '</h2>' +
            '<span class="phy_product_category">' + phyItem.phy_category + '</span>' +
          '</div>' +
          '<p class="phy_product_desc">' + phyItem.phy_desc + '</p>' +
          '<div class="phy_product_price_row">' +
            '<span class="phy_product_price">￥' + Number(phyItem.phy_price).toFixed(2) + '</span>' +
            '<span class="phy_product_price_unit">官方指导价</span>' +
          '</div>' +
        '</div>' +
      '</article>';
    }
    phyGridBox.innerHTML = phyHtml;
    phyCountBox.textContent = '共 ' + phyList.length + ' 件';
  }

  // 显示加载失败提示（红色卡片）
  function phyRenderError(phyMsg) {
    phyGridBox.innerHTML = '<div class="phy_products_error">✘ ' + phyMsg + '</div>';
    phyCountBox.textContent = '';
  }

  // 请求产品数据
  fetch(PHY_API_URL)
    .then(function (phyRes) { return phyRes.json(); })
    .then(function (phyData) {
      // 按约定把服务器返回数据输出到控制台
      console.log('产品列表接口返回：', phyData);
      if (phyData.code === 0 && phyData.data && phyData.data.list.length > 0) {
        phyRenderProducts(phyData.data.list);
      } else {
        phyRenderError(phyData.msg || '暂无产品数据');
      }
    })
    .catch(function (phyErr) {
      // 按约定把错误信息输出到控制台
      console.error('请求产品列表接口失败：', phyErr);
      phyRenderError('加载产品失败：' + phyErr.message);
    });
})();
