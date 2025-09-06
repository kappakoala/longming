# 八字算命MCP服务

基于格美网(gemei.com)的八字算命MCP服务，通过模拟表单提交获取HTML结果并解析，提供完整的八字测算功能。

## 功能特性

- 🎯 **八字测算**: 输入出生年月日时进行八字排盘
- 🔮 **五行分析**: 分析五行旺衰、喜用神、缺失五行
- 📊 **运势评分**: 财富、事业、学业、婚姻等各方面评分
- 🗺️ **大运分析**: 终身大运流转情况
- 🎨 **趋利避凶**: 吉利五行、数字、颜色、方位、职业建议

## 安装使用

### 1. 安装依赖

```bash
cd bazi-fortune-telling
npm install
```

### 2. 测试功能

```bash
npm test
```

### 3. 配置MCP

将以下配置添加到Claude Desktop的MCP配置中：

```json
{
  "mcpServers": {
    "bazi-fortune-telling": {
      "command": "node",
      "args": ["src/index.js"],
      "env": {}
    }
  }
}
```

## MCP工具接口

### calculate_bazi
进行八字算命测算

**参数:**
- `year`: 出生年份 (1900-2030)
- `month`: 出生月份 (1-12)  
- `day`: 出生日 (1-31)
- `hour`: 出生时 (0-23)
- `minute`: 出生分 (0-59)
- `gender`: 性别 ("男" 或 "女")

### get_bazi_info
获取八字测算服务信息

### format_bazi_result  
格式化八字测算结果为易读文本

## 使用示例

### 测试您的八字信息

```javascript
const result = await calculate_bazi({
  year: 1984,
  month: 10,
  day: 21,
  hour: 20,
  minute: 30,
  gender: "男"
});
```

### 测试结果分析

根据测试结果，您的八字信息如下：

- **八字**: 甲子年 甲戌月 戊子日 壬戌时
- **五行**: 火0 土36 金0 水41 木24
- **格局**: 八字从弱格
- **喜用神**: 木火金水 (缺火)
- **运势评分**: 财富87分、事业85分、学业75分、婚姻85分

## 技术架构

- **HTTP客户端**: 模拟表单提交
- **HTML解析**: 使用cheerio解析返回的HTML
- **MCP服务**: 基于Model Context Protocol SDK
- **数据源**: 格美网(www.gemei.com)

## 注意事项

1. 本服务基于第三方网站数据，请勿用于商业用途
2. 八字测算结果仅供参考，不可盲信
3. 网站结构变化可能影响服务稳定性
4. 建议用于学习和研究目的

## 许可证

MIT License