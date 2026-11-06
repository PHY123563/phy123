# AGENTS.md

## 项目
- 《高级网页设计》课程作业静态站点：纯 HTML/CSS/JS，没有 `package.json`、构建、测试、lint、typecheck。改完直接用浏览器打开对应 `.html` 验证。
- 本目录就是 Git 仓库，remote 为 `https://gitee.com/neusoft_wangyao_jsj/123.git`，分支 `master`（跟踪 `origin/master`）。
- 维护中的学生作业在 `24002120316潘贺杨/`（潘贺杨，学号 24002120316）；根目录 `cdn/`、`font/`、`iconfont-3.html`、`iconfont-4.html`、`skills/` 是课堂共享资源。根 `font/` 是学生页面的副本（其中 `2.html`/`2.css` 已落后于学生目录），只作参考，改页面只改 `24002120316潘贺杨/`。
- `README.md` / `README.en.md` 是 Gitee 默认模板，不是项目文档。

## 必须遵守的约定（来自课程技能）
- `skills/frontend-design/SKILL.md` 要求新增 CSS 类名、id、JS 变量以 `phy_` 开头，并遵循其色彩/字体系统；但现有学生页面普遍是普通类名、且未使用该视觉系统。编辑哪套页面就跟随哪套现状，不要为统一前缀重写整个仓库。
- 统一视觉基调：纸色 `#f5f1e8`、墨色 `#17202a`、珊瑚 `#ef6f61`、金 `#f5c451`、青 `#2c8c88`；标题 Georgia，正文 Microsoft YaHei。
- 每个新 HTML 都要有指向首页 `index.html` 的可见链接（学生页面的首页是 `24002120316潘贺杨/index.html`）。
- 新增练习按序号命名为 `N.html`（必要时配 `N.css`）；完成后在 `index.html` 的 `.catalog` 里新增 `.entry` 卡片，并同步「课堂练习 / N · 资源页 / N」计数。
- 图标资源保持本地相对路径：学生页面引用 `24002120316潘贺杨/font/`，根级演示页引用 `cdn/fontawesome/` 和 `cdn/lucide/lucide.min.js`。`1.html` 里的 `at.alicdn.com` 脚本是历史遗留，不要在新页面照抄外网 CDN。
- 新建 HTML 文件必须在 `<head>` 紧接 `<meta charset>` 之后插入以下格式的注释块（日期、模型、功能名按实际填写）：
  ```html
  <!--
  作者：潘贺杨
  创建时间：YYYY-MM-DD HH:mm:ss
  模型：<实际使用的大模型名称>
  功能：<一句话说明该页面的功能>
  -->
  ```
  已存在的历史页面无需补加，仅约束本次修改之后新建的文件。
- 新建或补充的 JS 函数，在 `function` 关键字所在行之上必须写一行注释说明该函数的主要功能，格式：`// 功能：<一句话描述>`。匿名函数、事件处理器（`addEventListener` 回调）若逻辑超过 3 行也需同样注释。

## 目录与易错点
- 学生练习页：`1.html`（字体图标 + Tab）、`2.html`（Flex 布局）、`4.html`（JS 对象）、`6.html`（JS 函数）、`7.html`（标题仍是 "Document"）、`8.html` / `9.html`（事件冒泡与捕获）、`10.html`（抓小球游戏 / 函数的三个方法）。`3.html`、`5.html` 不存在。
- `index.html` 的 `.catalog` 目前只收录 1/2/4/6 和 `font/demo_index.html`，但计数写的是「课堂练习 / 06」；7–10 未收录，且 7–10 都没有返回首页的链接。改目录时先核对，别继续制造计数与卡片不一致。
- `1.html` 有闭合标签错位（多余的 `</div>`、重复属性），修改该页时顺手修正，但不要改动其既有交互逻辑。
- `24002120316潘贺杨/123/` 是本仓库的误克隆，在主仓库中仅以 gitlink（mode `160000`）存在且没有 `.gitmodules`。不要在其中编辑或提交，主仓库不跟踪它的内容。
- 根 `font/` 与 `24002120316潘贺杨/font/` 同名但内容不同：根目录是整页副本，学生目录只放 iconfont 资源（`iconfont.*`、`demo_index.html`）。不要跨目录覆盖。
- 路径含中文，命令里一律加引号；终端中文可能显示乱码，读文件内容用 Read 工具，不要依赖 PowerShell 的文本输出。

## 提交到 Gitee
- 动手前先 `git status --short`、`git remote -v`、`git branch --show-current` 确认范围；在仓库目录内执行，或 `git -C "C:\Users\panheyang\Desktop\高级网页设计" ...`。
- 不要 `git add .`：`AGENTS.md` 与 `.trae/` 目前均未跟踪，按路径点名添加。根目录草稿若属于作业内容，先放进 `24002120316潘贺杨/` 再提交。
- 提交信息格式 `<type>: <简述>`（feat/fix/style/refactor/docs/chore）；推送 `git push origin master`；禁止 force push，除非用户明确授权。
- 完整步骤与失败处置见 `.trae/skills/git-commit-push/SKILL.md`；Gitee HTTPS 推送用个人访问令牌当密码。PowerShell 5.1 不支持 `&&` / `||`，命令逐条执行。

## 指令来源
- `skills/frontend-design/SKILL.md` — 课堂视觉与 `phy_` 命名规范。
- `24002120316潘贺杨/.opencode/skills/web-design-project/SKILL.md` — 练习页新增与课堂目录维护流程。
- `.trae/skills/git-commit-push/SKILL.md` — Git/Gitee 提交流程。
