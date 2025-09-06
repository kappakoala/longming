# 🔮 龙铭大师八字测算 MCP 服务

[![npm version](https://img.shields.io/npm/v/@longming/bazi-fortune-mcp.svg)](https://www.npmjs.com/package/@longming/bazi-fortune-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)

一个基于传统命理学的智能八字测算 MCP (Model Context Protocol) 服务，可以根据用户的出生信息生成详细的八字分析报告。

## ✨ 功能特点

- 🔮 **完整的八字测算分析** - 基于传统干支历法和五行理论
- 📊 **运势评分系统** - 财富、事业、学业、婚姻、交际、机遇六维度评分
- 🎯 **五行喜用神分析** - 智能分析五行平衡和喜用神
- 📈 **大运流年预测** - 提供各年龄段运势分析
- 🎨 **适合职业和方位建议** - 个性化的人生建议
- 📝 **详细的命理解读** - 专业的命理分析和建议
- 🤖 **MCP 标准协议** - 完全兼容 Claude 和其他 AI 助手

## 🚀 快速安装

### 使用 npm 安装

```bash
npm install -g @longming/bazi-fortune-mcp
```

### 使用 npx 直接运行

```bash
npx @longming/bazi-fortune-mcp
```

## 🛠️ 使用方法

### 1. 命令行直接运行

```bash
# 全局安装后
bazi-fortune-mcp

# 或者直接运行
node bazi-fortune-telling-mcp.js
```

### 2. 配置到 Claude Desktop

在您的 Claude Desktop 配置文件中添加以下配置：

#### 方法 A: 使用全局安装

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

#### 方法 B: 使用 npx

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

#### 方法 C: 本地开发

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

## 可用工具

### `calculate_bazi`

根据出生年月日时和性别进行八字测算打分。

**参数：**
- `year` (string): 出生年份 (例如: "2005")
- `month` (string): 出生月份 (例如: "1")
- `day` (string): 出生日期 (例如: "21")
- `hour` (string): 出生小时 (例如: "2")
- `minute` (string): 出生分钟 (例如: "30")
- `gender` (string): 性别 ("男" 或 "女")


## 输出格式

服务会返回包含以下内容的 Markdown 格式报告：

1. **基本信息**
   - 公历生日
   - 农历生日
   - 八字组合

2. **运势评分**
   - 财富评分
   - 事业评分
   - 学业评分
   - 婚姻评分
   - 交际评分
   - 机遇评分
   - 运势评分

3. **八字命盘**
   - 天干地支
   - 五行分析
   - 纳音五行
   - 旺衰状态

4. **命理分析**
   - 神煞分析
   - 命局特点
   - 运势走向

5. **五行喜用神**
   - 五行得分
   - 喜用神分析
   - 缺失五行

6. **大运分析**
   - 各年龄段运势
   - 流年变化

7. **趋利避凶建议**
   - 吉利五行
   - 吉利数字
   - 吉利颜色
   - 有利方位
   - 适合职业

## 🎨 应用场景

- 👤 **个人命理咨询** - 为用户提供个性化八字分析
- 🌐 **在线算命平台** - 集成到网站或APP中
- 🤖 **AI助手增强** - 为聊天机器人添加命理功能
- 📊 **命理研究工具** - 辅助专业命理师进行分析
- 📱 **移动应用** - 快速集成到移动端应用

## 🔧 技术实现

- **数据源**: 格美起名网 (http://www.gemei.com/bazi/)
- **协议**: MCP (Model Context Protocol)
- **技术栈**: Node.js, JSDOM, node-fetch
- **数据处理**: HTML解析 + Markdown转换
- **兼容性**: 支持 Claude、ChatGPT 等各类 AI 助手

## 🛡️ 注意事项

1. 本服务仅供娱乐和研究使用，不构成专业命理建议
2. 测算结果基于传统命理学说，请理性看待
3. 建议结合实际情况和个人努力来规划人生
4. 服务依赖外部网站，如遇网站变更可能需要调整
5. 请确保网络连接稳定，以获得最佳体验

## 🔄 更新日志

### v1.0.0 (2024-01-01)
- ✨ 初始发布
- 🔮 支持完整的八字测算功能
- 📊 实现六维运势评分系统
- 🎯 支持五行分析和喜用神推算
- 🔧 标准化 MCP 协议实现

## 🤝 贡献

欢迎提交问题和改进建议！

1. Fork 本项目
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 🔗 相关链接

- [NPM 包地址](https://www.npmjs.com/package/@longming/bazi-fortune-mcp)
- [GitHub 仓库](https://github.com/longming-ai/bazi-fortune-mcp)
- [MCP 官方文档](https://modelcontextprotocol.io/)
- [Claude Desktop 配置指南](https://claude.ai/docs)

## ⚖️ 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

---

<div align="center">
  <p><strong>🔮 龙铭大师八字测算系统 - 传统智慧与现代技术的完美结合 🔮</strong></p>
  <p>如果这个项目对你有帮助，请给个 ⭐ 支持一下！</p>
</div>