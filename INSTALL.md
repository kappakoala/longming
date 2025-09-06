# 📦 完整安装使用指南

## 🎯 系统要求

- **Node.js**: >= 16.0.0
- **npm**: >= 7.0.0 （或 yarn >= 1.22.0）
- **操作系统**: Windows 10+, macOS 10.15+, Linux (Ubuntu 18.04+)
- **网络**: 稳定的互联网连接（访问格美起名网API）

## 🚀 安装方式

### 方式 1: NPM 全局安装（推荐）

```bash
# 安装
npm install -g @longming/bazi-fortune-mcp

# 验证安装
bazi-fortune-mcp --help

# 直接运行
bazi-fortune-mcp
```

### 方式 2: NPX 直接运行

```bash
# 无需安装，直接运行
npx @longming/bazi-fortune-mcp
```

### 方式 3: 本地项目安装

```bash
# 创建新项目
mkdir my-bazi-project
cd my-bazi-project

# 初始化 package.json
npm init -y

# 安装依赖
npm install @longming/bazi-fortune-mcp

# 创建启动脚本
echo "require('@longming/bazi-fortune-mcp')" > start.js

# 运行
node start.js
```

### 方式 4: 源码安装

```bash
# 克隆仓库
git clone https://github.com/longming-ai/bazi-fortune-mcp.git
cd bazi-fortune-mcp

# 安装依赖
npm install

# 运行
npm start
```

## 🔧 Claude Desktop 配置

### 1. 找到配置文件

#### macOS
```bash
~/Library/Application Support/Claude/claude_desktop_config.json
```

#### Windows
```bash
%APPDATA%\Claude\claude_desktop_config.json
```

#### Linux
```bash
~/.config/Claude/claude_desktop_config.json
```

### 2. 添加配置

选择以下任一配置方式：

#### 配置 A: 使用全局安装
```json
{
  "mcpServers": {
    "bazi-fortune": {
      "command": "bazi-fortune-mcp",
      "env": {}
    }
  }
}
```

#### 配置 B: 使用 npx
```json
{
  "mcpServers": {
    "bazi-fortune": {
      "command": "npx",
      "args": ["@longming/bazi-fortune-mcp"],
      "env": {}
    }
  }
}
```

#### 配置 C: 使用绝对路径
```json
{
  "mcpServers": {
    "bazi-fortune": {
      "command": "node",
      "args": ["/path/to/bazi-fortune-telling-mcp.js"],
      "env": {}
    }
  }
}
```

### 3. 重启 Claude Desktop

保存配置文件后，重启 Claude Desktop 应用程序。

## 🧪 验证安装

### 1. 检查 MCP 服务状态

在 Claude Desktop 中询问：
```
你现在有什么工具可以使用？
```

应该能看到 `calculate_bazi` 工具。

### 2. 测试八字计算

```
请使用八字测算工具分析1984年10月21日20点30分出生的男性的命理。
```

### 3. 命令行测试

```bash
# 运行测试脚本
npm test

# 或者直接测试
node test-service.js
```

## 🛠️ 故障排除

### 问题 1: 命令找不到

**错误**: `command not found: bazi-fortune-mcp`

**解决方案**:
```bash
# 检查全局安装位置
npm list -g @longming/bazi-fortune-mcp

# 重新全局安装
npm install -g @longming/bazi-fortune-mcp

# 或使用 npx
npx @longming/bazi-fortune-mcp
```

### 问题 2: Claude Desktop 无法连接

**错误**: Claude Desktop 中看不到工具

**解决方案**:
1. 检查配置文件语法是否正确（JSON格式）
2. 确认路径是否正确
3. 重启 Claude Desktop
4. 查看错误日志：

```bash
# macOS
tail -f ~/Library/Logs/Claude/claude_desktop.log

# Windows  
tail -f %LOCALAPPDATA%\Claude\Logs\claude_desktop.log
```

### 问题 3: 网络连接失败

**错误**: `无法连接到测算服务`

**解决方案**:
1. 检查网络连接
2. 确认可以访问 http://www.gemei.com/bazi/
3. 检查防火墙设置
4. 尝试使用代理：

```bash
export HTTP_PROXY=http://your-proxy:port
export HTTPS_PROXY=http://your-proxy:port
```

### 问题 4: Node.js 版本过低

**错误**: `require() of ES module not supported`

**解决方案**:
```bash
# 检查 Node.js 版本
node --version

# 升级到 16+ 版本
# 使用 nvm (推荐)
nvm install 18
nvm use 18

# 或直接从官网下载安装
# https://nodejs.org/
```

### 问题 5: 权限问题

**错误**: `EACCES: permission denied`

**解决方案**:
```bash
# macOS/Linux
sudo npm install -g @longming/bazi-fortune-mcp

# 或配置 npm 全局路径
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

## 📊 性能优化

### 1. 缓存配置

创建 `.bazi-cache` 目录来缓存请求：
```bash
mkdir ~/.bazi-cache
```

### 2. 网络超时设置

```bash
# 设置更长的超时时间
export BAZI_TIMEOUT=30000
```

### 3. 并发请求限制

```bash
# 限制并发请求数
export BAZI_CONCURRENCY=1
```

## 🔄 更新升级

### 检查更新
```bash
npm outdated -g @longming/bazi-fortune-mcp
```

### 升级到最新版本
```bash
npm update -g @longming/bazi-fortune-mcp
```

### 查看版本历史
```bash
npm view @longming/bazi-fortune-mcp versions --json
```

## 🆘 获取帮助

如果遇到问题，可以：

1. **查看日志**: 检查详细错误信息
2. **提交 Issue**: https://github.com/longming-ai/bazi-fortune-mcp/issues
3. **阅读文档**: [README.md](README.md)
4. **社区讨论**: 在 GitHub Discussions 中提问

## 🎉 安装完成！

恭喜您成功安装了龙铭大师八字测算 MCP 服务！

现在您可以：
- ✅ 在 Claude Desktop 中使用八字测算功能
- ✅ 为任何出生信息生成详细的命理分析
- ✅ 获得专业的运势评分和人生建议
- ✅ 体验传统智慧与现代AI的完美结合

享受您的八字测算之旅！🔮