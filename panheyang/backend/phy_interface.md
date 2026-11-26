# 后端接口记录（一律追加写入，禁止覆盖已有内容）

接口路径：/api/phy_health | HTTP 方法：GET | 请求参数：无（示例：GET http://localhost:8316/api/phy_health）| 响应格式：统一 JSON，code=0 表示成功。示例：

```json
{
  "code": 0,
  "msg": "服务运行正常",
  "data": {
    "time": "2026-11-20 12:00:00",
    "author": "潘贺杨 24002120316"
  }
}
```

| 修改时间：2026-11-20

接口路径：/api/phy_db_connect | HTTP 方法：POST | 请求参数：JSON body { "username": "root", "password": "xxxx" }（示例：POST http://localhost:8316/api/phy_db_connect）| 响应格式：统一 JSON，code=0 连接成功，code=1 连接失败。成功示例：

```json
{
  "code": 0,
  "msg": "MySQL 连接成功",
  "data": {
    "version": "8.0.36",
    "host": "localhost",
    "user": "root",
    "time": "2026-11-20 14:40:00"
  }
}
```

失败示例：

```json
{
  "code": 1,
  "msg": "MySQL 连接失败：用户名或密码错误，访问被拒绝",
  "data": null
}
```

| 修改时间：2026-11-20

接口路径：/api/phy_news | HTTP 方法：GET | 请求参数：无（示例：GET http://localhost:8316/api/phy_news）| 响应格式：统一 JSON，code=0 表示成功。data.list 为数据库 phy_news 表全部新闻（按发布时间倒序）。示例：

```json
{
  "code": 0,
  "msg": "新闻列表查询成功",
  "data": {
    "count": 10,
    "list": [
      {
        "phy_id": 1,
        "phy_title": "国产大模型推理成本再降 60%，端侧部署成为行业新趋势",
        "phy_category": "人工智能",
        "phy_source": "科技日报",
        "phy_summary": "多家厂商相继发布轻量化推理框架……",
        "phy_published_at": "2026-11-19T01:30:00.000Z"
      }
    ]
  }
}
```

失败示例：{ "code": 1, "msg": "新闻列表查询失败：……", "data": null } | 修改时间：2026-11-20

接口路径：/api/phy_products | HTTP 方法：GET | 请求参数：无（示例：GET http://localhost:8316/api/phy_products）| 响应格式：统一 JSON，code=0 表示成功。data.list 为数据库 phy_product 表全部产品（含图片路径 phy_image，相对 frontend/ 目录）。示例：

```json
{
  "code": 0,
  "msg": "产品列表查询成功",
  "data": {
    "count": 8,
    "list": [
      {
        "phy_id": 1,
        "phy_name": "星屿智能手表 X1",
        "phy_category": "智能穿戴",
        "phy_price": "1299.00",
        "phy_desc": "1.85 英寸柔性 AMOLED 屏，支持血氧心率监测与 14 天超长续航，50 米防水。",
        "phy_image": "images/phy_product_1.svg",
        "phy_created_at": "2026-11-20T06:50:00.000Z"
      }
    ]
  }
}
```

失败示例：{ "code": 1, "msg": "产品列表查询失败：……", "data": null } | 修改时间：2026-11-20

接口路径：/api/phy_chat | HTTP 方法：POST | 请求参数：JSON body { "messages": [{ "role": "user", "content": "你好" }], "apiKey": "可选，未传时读取 backend/.env 的 SILICONFLOW_API_KEY" }（示例：POST http://localhost:8316/api/phy_chat）| 响应格式：成功时为 SSE 流式（Content-Type: text/event-stream），每行为 `data: {OpenAI 格式 chunk}`，以 `data: [DONE]` 结束；密钥缺失或入参错误时返回统一 JSON，code=1。错误示例：

```json
{
  "code": 1,
  "msg": "未配置硅基流动密钥：请在页面填写 API Key，或在 backend/.env 里配置 SILICONFLOW_API_KEY",
  "data": null
}
```

| 修改时间：2026-11-25

