# 📦 发布指南

## 🎯 前置条件

1. **NPM 账号**: 确保你有一个 NPM 账号
   - 如果没有，请访问 https://www.npmjs.com/ 注册
   - 记住你的用户名、密码和邮箱

2. **命令行工具**: 确保已安装 Node.js 和 npm

## 🚀 发布步骤

### 1. 登录 NPM 账号

```bash
cd /Users/koala/Documents/E.T.Koala/Agents/龙铭大师/cc
npm login
```

系统会要求输入：
- Username（用户名）
- Password（密码）
- Email（邮箱）
- 可能还需要输入 2FA 验证码

### 2. 验证登录状态

```bash
npm whoami
```

应该显示你的 NPM 用户名。

### 3. 最终检查

```bash
# 检查包信息
npm pack --dry-run

# 运行测试
npm test

# 检查文件列表
npm publish --dry-run
```

### 4. 发布到 NPM

```bash
npm publish --access public
```

**注意**: 由于使用了 scoped package name (`@longming/bazi-fortune-mcp`)，需要添加 `--access public` 参数。

## 🔄 更新版本

如果需要发布新版本：

```bash
# 更新补丁版本 (1.0.0 -> 1.0.1)
npm version patch

# 更新次版本 (1.0.0 -> 1.1.0)
npm version minor

# 更新主版本 (1.0.0 -> 2.0.0)
npm version major

# 发布新版本
npm publish --access public
```

## 🐛 常见问题

### 1. 包名已存在

如果遇到包名冲突，修改 `package.json` 中的 `name` 字段：

```json
{
  "name": "@your-username/bazi-fortune-mcp"
}
```

### 2. 权限问题

确保你有发布权限，如果是组织包，需要组织管理员授权。

### 3. 网络问题

如果发布失败，可以尝试：

```bash
npm config set registry https://registry.npmjs.org/
npm publish --access public
```

## ✅ 发布成功后

### 1. 验证发布

访问 https://www.npmjs.com/package/@longming/bazi-fortune-mcp 查看包页面。

### 2. 测试安装

在其他目录测试安装：

```bash
# 测试全局安装
npm install -g @longming/bazi-fortune-mcp

# 测试命令行工具
bazi-fortune-mcp

# 测试 npx 直接运行
npx @longming/bazi-fortune-mcp
```

### 3. 更新 README

确保 README 中的所有链接和徽章都正确指向已发布的包。

## 🔗 相关链接

- [NPM 官方文档](https://docs.npmjs.com/)
- [发布 Scoped Packages](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages)
- [NPM CLI 命令参考](https://docs.npmjs.com/cli/v8/commands)

---

## 🎉 祝贺！

一旦发布成功，你的龙铭大师八字测算 MCP 服务就可以供全世界的开发者使用了！

记得在社交媒体或开发者社区分享你的项目，让更多人知道这个有趣的工具。