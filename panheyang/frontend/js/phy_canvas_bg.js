/**
 * 姓名：潘贺杨 | 学号：24002120316 | 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 功能：首页 canvas 背景动画。粒子漂浮 + 距离连线 + 鼠标吸附交互，铺满全屏。
 */
(function () {
  var phyCanvas = document.getElementById('phy_canvas_bg');
  var phyCtx = phyCanvas.getContext('2d');

  var phyParticles = [];      // 粒子数组
  var phyMouse = { x: null, y: null };
  var PHY_COUNT = 90;         // 粒子数量
  var PHY_LINK_DIST = 130;    // 粒子连线距离阈值
  var PHY_MOUSE_DIST = 170;   // 鼠标连线距离阈值

  // 调整画布尺寸以铺满窗口
  function phyResize() {
    phyCanvas.width = window.innerWidth;
    phyCanvas.height = window.innerHeight;
  }

  // 初始化粒子：随机位置与速度
  function phyInitParticles() {
    phyParticles = [];
    for (var i = 0; i < PHY_COUNT; i++) {
      phyParticles.push({
        x: Math.random() * phyCanvas.width,
        y: Math.random() * phyCanvas.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        r: Math.random() * 1.8 + 0.8
      });
    }
  }

  // 绘制单帧：清屏、移动粒子、画点、按距离连线
  function phyDraw() {
    phyCtx.clearRect(0, 0, phyCanvas.width, phyCanvas.height);

    for (var i = 0; i < phyParticles.length; i++) {
      var phyP = phyParticles[i];

      // 粒子移动与边界反弹
      phyP.x += phyP.vx;
      phyP.y += phyP.vy;
      if (phyP.x < 0 || phyP.x > phyCanvas.width) phyP.vx *= -1;
      if (phyP.y < 0 || phyP.y > phyCanvas.height) phyP.vy *= -1;

      // 绘制粒子圆点
      phyCtx.beginPath();
      phyCtx.arc(phyP.x, phyP.y, phyP.r, 0, Math.PI * 2);
      phyCtx.fillStyle = 'rgba(143, 211, 255, 0.75)';
      phyCtx.fill();

      // 粒子之间的连线
      for (var j = i + 1; j < phyParticles.length; j++) {
        var phyQ = phyParticles[j];
        var phyDx = phyP.x - phyQ.x;
        var phyDy = phyP.y - phyQ.y;
        var phyDist = Math.sqrt(phyDx * phyDx + phyDy * phyDy);
        if (phyDist < PHY_LINK_DIST) {
          phyCtx.beginPath();
          phyCtx.moveTo(phyP.x, phyP.y);
          phyCtx.lineTo(phyQ.x, phyQ.y);
          phyCtx.strokeStyle = 'rgba(120, 160, 255, ' + (0.35 * (1 - phyDist / PHY_LINK_DIST)) + ')';
          phyCtx.lineWidth = 1;
          phyCtx.stroke();
        }
      }

      // 鼠标附近的粒子连线，形成交互光效
      if (phyMouse.x !== null) {
        var phyMdx = phyP.x - phyMouse.x;
        var phyMdy = phyP.y - phyMouse.y;
        var phyMDist = Math.sqrt(phyMdx * phyMdx + phyMdy * phyMdy);
        if (phyMDist < PHY_MOUSE_DIST) {
          phyCtx.beginPath();
          phyCtx.moveTo(phyP.x, phyP.y);
          phyCtx.lineTo(phyMouse.x, phyMouse.y);
          phyCtx.strokeStyle = 'rgba(180, 155, 255, ' + (0.45 * (1 - phyMDist / PHY_MOUSE_DIST)) + ')';
          phyCtx.lineWidth = 1;
          phyCtx.stroke();
        }
      }
    }

    requestAnimationFrame(phyDraw);
  }

  // 记录鼠标位置（相对于页面）
  window.addEventListener('mousemove', function (phyEvent) {
    phyMouse.x = phyEvent.clientX;
    phyMouse.y = phyEvent.clientY;
  });
  window.addEventListener('mouseout', function () {
    phyMouse.x = null;
    phyMouse.y = null;
  });

  // 窗口变化时重建画布尺寸并重排粒子
  window.addEventListener('resize', function () {
    phyResize();
    phyInitParticles();
  });

  phyResize();
  phyInitParticles();
  phyDraw();
})();
