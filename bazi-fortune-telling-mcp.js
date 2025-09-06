#!/usr/bin/env node

const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require("@modelcontextprotocol/sdk/types.js");
const fetch = require('node-fetch');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

class BaziFortuneTellingServer {
  constructor() {
    this.server = new Server(
      {
        name: "bazi-fortune-telling-server",
        version: "1.0.0",
        description: "八字测算打分 MCP 服务 - 基于格美起名网的八字分析系统",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "calculate_bazi",
            description: "根据出生年月日时和性别进行八字测算打分",
            inputSchema: {
              type: "object",
              properties: {
                year: {
                  type: "string",
                  description: "出生年份 (例如: 2025)",
                },
                month: {
                  type: "string", 
                  description: "出生月份 (例如: 1)",
                },
                day: {
                  type: "string",
                  description: "出生日期 (例如: 2)",
                },
                hour: {
                  type: "string",
                  description: "出生小时 (例如: 3)",
                },
                minute: {
                  type: "string",
                  description: "出生分钟 (例如: 4)",
                },
                gender: {
                  type: "string",
                  description: "性别 (男/女)",
                  enum: ["男", "女"],
                },
              },
              required: ["year", "month", "day", "hour", "minute", "gender"],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      if (name === "calculate_bazi") {
        try {
          const result = await this.calculateBazi(args);
          return {
            content: [
              {
                type: "text",
                text: result,
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `八字测算失败: ${error.message}`,
              },
            ],
            isError: true,
          };
        }
      }

      throw new Error(`未知的工具: ${name}`);
    });
  }

  async calculateBazi(params) {
    const { year, month, day, hour, minute, gender } = params;

    // 构建表单数据
    const formData = new URLSearchParams();
    formData.append('y', year);
    formData.append('m', month);
    formData.append('d', day);
    formData.append('h', hour);
    formData.append('i', minute);
    formData.append('s', gender === '男' ? '1' : '2');

    try {
      // 发送POST请求到格美起名网
      const response = await fetch('http://www.gemei.com/bazi/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP错误! 状态: ${response.status}`);
      }

      const html = await response.text();
      
      // 使用JSDOM解析HTML
      const dom = new JSDOM(html);
      const document = dom.window.document;

      // 提取主要内容区域
      const contentDiv = document.querySelector('.read-content') || 
                        document.querySelector('.content') || 
                        document.querySelector('main');

      let resultHtml;
      if (contentDiv) {
        resultHtml = contentDiv.innerHTML;
      } else {
        // 如果没有找到特定的内容div，获取主要结果区域
        const resultArea = document.querySelector('h2')?.parentElement?.parentElement;
        resultHtml = resultArea ? resultArea.innerHTML : document.body.innerHTML;
      }

      // 转换为Markdown
      const markdown = this.htmlToMarkdown(resultHtml, params);
      
      return markdown;

    } catch (error) {
      console.error('请求失败:', error);
      throw new Error(`无法连接到测算服务: ${error.message}`);
    }
  }

  htmlToMarkdown(html, params) {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    let markdown = '';

    // 添加标题
    markdown += `# ${params.year}年${params.month}月${params.day}日${params.hour}时${params.minute}分${params.gender}命八字测算打分\n\n`;

    // 处理段落
    document.querySelectorAll('p').forEach(p => {
      const text = p.textContent.trim();
      if (text && !text.includes('展开剩余') && !text.includes('本站声明')) {
        markdown += `${text}\n\n`;
      }
    });

    // 处理标题
    document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => {
      const level = parseInt(h.tagName.charAt(1));
      const text = h.textContent.trim();
      if (text) {
        markdown += `${'#'.repeat(level)} ${text}\n\n`;
      }
    });

    // 处理表格
    document.querySelectorAll('table').forEach(table => {
      markdown += this.processTable(table);
    });

    // 处理列表
    document.querySelectorAll('ul, ol').forEach(list => {
      markdown += this.processList(list);
    });

    // 处理特殊内容 - 八字信息
    const baziInfo = this.extractBaziInfo(document);
    if (baziInfo) {
      markdown += '## 八字基本信息\n\n';
      Object.entries(baziInfo).forEach(([key, value]) => {
        markdown += `**${key}:** ${value}\n`;
      });
      markdown += '\n';
    }

    // 处理特殊内容 - 运势评分
    const scores = this.extractScores(document);
    if (scores) {
      markdown += '## 运势评分\n\n';
      Object.entries(scores).forEach(([key, value]) => {
        markdown += `- **${key}:** ${value}\n`;
      });
      markdown += '\n';
    }

    return markdown;
  }

  processTable(table) {
    let markdown = '\n';
    
    // 处理表头
    const headers = table.querySelectorAll('tr:first-child td, tr:first-child th');
    if (headers.length > 0) {
      markdown += '| ';
      headers.forEach(header => {
        markdown += `${header.textContent.trim()} | `;
      });
      markdown += '\n';
      
      markdown += '| ';
      headers.forEach(() => {
        markdown += '--- | ';
      });
      markdown += '\n';
    }

    // 处理表格行
    const rows = table.querySelectorAll('tr:not(:first-child)');
    rows.forEach(row => {
      const cells = row.querySelectorAll('td, th');
      if (cells.length > 0) {
        markdown += '| ';
        cells.forEach(cell => {
          markdown += `${cell.textContent.trim()} | `;
        });
        markdown += '\n';
      }
    });

    markdown += '\n';
    return markdown;
  }

  processList(list) {
    let markdown = '\n';
    const items = list.querySelectorAll('li');
    
    items.forEach((item, index) => {
      const text = item.textContent.trim();
      if (text) {
        if (list.tagName === 'OL') {
          markdown += `${index + 1}. ${text}\n`;
        } else {
          markdown += `- ${text}\n`;
        }
      }
    });

    markdown += '\n';
    return markdown;
  }

  extractBaziInfo(document) {
    const baziInfo = {};
    
    // 提取基本信息
    const basicInfo = document.querySelectorAll('p');
    basicInfo.forEach(p => {
      const text = p.textContent.trim();
      if (text.includes('男命：')) {
        baziInfo['公历生日'] = text.replace('男命：', '').trim();
      } else if (text.includes('农历：')) {
        baziInfo['农历生日'] = text.replace('农历：', '').trim();
      } else if (text.includes('八字：')) {
        baziInfo['八字'] = text.replace('八字：', '').trim();
      }
    });

    return Object.keys(baziInfo).length > 0 ? baziInfo : null;
  }

  extractScores(document) {
    const scores = {};
    
    // 查找分数信息 - 使用正确的选择器语法
    const scoreElements = document.querySelectorAll('td');
    scoreElements.forEach(element => {
      const text = element.textContent.trim();
      if (text.includes('分') && text.length < 20) {
        const parts = text.split(' ');
        if (parts.length === 2) {
          scores[parts[0]] = parts[1];
        }
      }
    });

    return Object.keys(scores).length > 0 ? scores : null;
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("八字测算打分 MCP 服务器已启动");
  }
}

// 启动服务器
if (require.main === module) {
  const server = new BaziFortuneTellingServer();
  server.run().catch(console.error);
}

// 导出类供测试使用
module.exports = { BaziFortuneTellingServer };