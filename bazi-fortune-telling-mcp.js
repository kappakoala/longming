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

    // 不再需要Turndown服务，直接提取原始内容

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

      // 只查找class="read-content"的div标签
      const contentDiv = document.querySelector('.read-content');
      
      if (!contentDiv) {
        throw new Error('未找到read-content内容区域');
      }

      // 直接提取文本内容
      const content = this.extractContent(contentDiv, params);
      
      return content;

    } catch (error) {
      console.error('请求失败:', error);
      throw new Error(`无法连接到测算服务: ${error.message}`);
    }
  }

  extractContent(contentDiv, params) {
    // 添加主标题
    let title = `${params.year}年${params.month}月${params.day}日${params.hour}时${params.minute}分${params.gender}命八字测算打分\n\n`;
    
    // 直接提取文本内容，保持原始格式
    const textContent = contentDiv.textContent || contentDiv.innerText || '';
    
    return title + textContent;
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