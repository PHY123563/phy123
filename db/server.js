const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3004;

// 允许跨域：前端用 file:// 直接打开也能请求
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// 启动时只读一次 db.json，改完数据要重启服务才生效
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'), 'utf8'));

app.get('/api/poems', (req, res) => {
  res.json(data.poems);
});

app.listen(PORT, () => {
  console.log(`数据服务器已启动: http://localhost:${PORT}/api/poems`);
});
