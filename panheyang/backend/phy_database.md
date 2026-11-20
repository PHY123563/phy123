# 数据库操作记录（一律追加写入，按执行顺序记录，仅凭此文件可在新机器上完整重建数据库）

执行时间：2026-11-20 | 操作：创建数据库、创建表、插入测试数据 | 执行方式：Node.js 临时脚本（mysql2）

```sql
-- 1. 创建数据库
CREATE DATABASE IF NOT EXISTS phy_web DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE phy_web;

-- 2. 创建科技新闻表
CREATE TABLE IF NOT EXISTS phy_news (
  phy_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '新闻ID',
  phy_title VARCHAR(200) NOT NULL COMMENT '新闻标题',
  phy_category VARCHAR(50) NOT NULL COMMENT '新闻分类',
  phy_source VARCHAR(100) NOT NULL COMMENT '新闻来源',
  phy_summary VARCHAR(500) NOT NULL COMMENT '新闻摘要',
  phy_published_at DATETIME NOT NULL COMMENT '发布时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='科技新闻表';

-- 3. 插入测试数据（共 10 条）
INSERT INTO phy_news (phy_title, phy_category, phy_source, phy_summary, phy_published_at) VALUES
('国产大模型推理成本再降 60%，端侧部署成为行业新趋势', '人工智能', '科技日报', '多家厂商相继发布轻量化推理框架，千亿参数模型可在消费级显卡上流畅运行，端侧 AI 应用生态加速成型。', '2026-11-19 09:30:00'),
('6G 技术标准草案获国际电联初步通过，2030 年有望商用', '通信技术', '新华网', '本轮会议上 6G 愿景与关键技术指标框架获得通过，太赫兹通信与智能超表面成为标准核心方向。', '2026-11-18 14:10:00'),
('固态电池量产线正式投产，新能源汽车续航突破 1500 公里', '新能源', '第一财经', '首条全固态动力电池量产线宣布投产，能量密度较液态电池提升一倍以上，充电时间缩短至 12 分钟。', '2026-11-17 10:05:00'),
('量子计算原型机完成千比特级操控验证，纠错能力大幅提升', '量子科技', '中国科学报', '研究团队实现了千比特规模量子比特的相干操控，逻辑量子比特错误率降至百万分之一以下。', '2026-11-16 11:20:00'),
('开源鸿蒙生态设备数突破 10 亿，跨端协同体验全面升级', '操作系统', '人民网', '开源鸿蒙社区宣布生态设备数量突破 10 亿台，分布式软总线时延进一步降低至毫秒级。', '2026-11-15 08:45:00'),
('AI 制药首个完全由算法设计的化合物进入 III 期临床', '生物医药', '医药观察', '由生成式模型全程参与设计的抗肿瘤小分子化合物顺利进入 III 期临床，研发周期缩短近一半。', '2026-11-14 16:00:00'),
('空间站新实验舱完成在轨组装，微重力材料研究全面展开', '航空航天', '央视新闻', '新实验舱完成对接与转位，科研人员将开展半导体晶体、新型合金等 40 余项微重力实验。', '2026-11-13 20:30:00'),
('脑机接口临床试验获批，瘫痪患者实现意念操控机械臂', '脑科学', '科技周刊', '侵入式脑机接口系统获批进入多中心临床试验，首批受试者已可通过意念完成抓握动作。', '2026-11-12 13:15:00'),
('室温超导复现实验取得阶段性进展，多家实验室宣布部分验证', '前沿材料', '科学网', '三家独立实验室先后宣布复现出零电阻特征，但抗磁性数据仍待进一步交叉验证。', '2026-11-11 15:40:00'),
('低空经济新航路开通，无人机物流常态化运营城市增至 30 个', '智慧物流', '经济日报', '全国低空物流航路网络持续扩容，城市即时配送平均时效提升至 18 分钟。', '2026-11-10 09:00:00');
```

执行时间：2026-11-20 | 操作：创建表、插入测试数据 | 执行方式：Node.js 临时脚本（mysql2）

```sql
-- 4. 创建智能硬件产品表（图文列表）
CREATE TABLE IF NOT EXISTS phy_product (
  phy_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '产品ID',
  phy_name VARCHAR(100) NOT NULL COMMENT '产品名称',
  phy_category VARCHAR(50) NOT NULL COMMENT '产品分类',
  phy_price DECIMAL(10,2) NOT NULL COMMENT '产品价格（元）',
  phy_desc VARCHAR(500) NOT NULL COMMENT '产品简介',
  phy_image VARCHAR(200) NOT NULL COMMENT '产品图片路径（相对 frontend/ 目录）',
  phy_created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '上架时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='智能硬件产品表';

-- 5. 插入测试数据（共 8 条，图片文件位于 frontend/images/phy_product_1.svg ~ phy_product_8.svg）
INSERT INTO phy_product (phy_name, phy_category, phy_price, phy_desc, phy_image) VALUES
('星屿智能手表 X1', '智能穿戴', 1299.00, '1.85 英寸柔性 AMOLED 屏，支持血氧心率监测与 14 天超长续航，50 米防水。', 'images/phy_product_1.svg'),
('全景降噪耳机 Pro', '音频设备', 899.00, '主动降噪深度达 45dB，金标 Hi-Fi 认证，单次续航 10 小时，支持无线充电。', 'images/phy_product_2.svg'),
('幻影 Fold 折叠屏手机', '移动通讯', 8999.00, '8.2 英寸内折大屏，航空级铰链支持 40 万次折叠，双扬声器杜比全景声。', 'images/phy_product_3.svg'),
('小屿家用服务机器人', '智慧家庭', 4599.00, '语音交互与家庭管家中枢，可自动巡航建图，联动全屋智能设备。', 'images/phy_product_4.svg'),
('光影便携激光投影仪', '影音娱乐', 3299.00, '1080P 高清激光投影，800 ANSI 流明，机身仅重 0.9kg，自动对焦校正。', 'images/phy_product_5.svg'),
('恒温智能水杯', '智能生活', 199.00, 'OLED 温度显示屏，55° 恒温保温 8 小时，饮水 reminders 智能提醒。', 'images/phy_product_6.svg'),
('猎风四足机器狗', '机器人', 12999.00, '12 自由度仿生运动，最大速度 4.5m/s，支持视觉跟随与地形自适应。', 'images/phy_product_7.svg'),
('疾速固态移动硬盘', '存储设备', 1099.00, 'USB4 接口读取 3800MB/s，2TB 容量，金属机身 RGB 状态灯，仅重 105g。', 'images/phy_product_8.svg');
```

执行时间：2026-11-20 | 操作：插入测试数据（补足至 10 条，对齐课程示例） | 执行方式：Node.js 临时脚本（mysql2）

```sql
-- 6. 追加 2 条产品数据（图片文件位于 frontend/images/phy_product_9.svg、phy_product_10.svg）
INSERT INTO phy_product (phy_name, phy_category, phy_price, phy_desc, phy_image) VALUES
('星语智能音箱 Mini', '智能家居', 499.00, '360° 全向拾音喇叭，支持离线语音唤醒与全屋设备控制，织物机身仅重 0.6kg。', 'images/phy_product_9.svg'),
('云枢 4K 运动相机', '影像设备', 2199.00, '4K/120 帧防抖拍摄，10 米裸机防水，双触屏设计，磁吸快拆配件生态。', 'images/phy_product_10.svg');
```

