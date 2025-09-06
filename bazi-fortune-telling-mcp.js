#!/usr/bin/env node

const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require("@modelcontextprotocol/sdk/types.js");
const fetch = require('node-fetch');
const jsdom = require('jsdom');
const TurndownService = require('turndown');
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

    // 初始化Turndown服务
    this.turndownService = new TurndownService({
      headingStyle: 'atx',  // 使用 # 风格的标题
      codeBlockStyle: 'fenced',  // 使用 ``` 风格的代码块
      bulletListMarker: '-',  // 使用 - 作为列表标记
      emDelimiter: '*',  // 使用 * 作为强调标记
      strongDelimiter: '**',  // 使用 ** 作为粗体标记
    });

    // 自定义规则：忽略img标签
    this.turndownService.addRule('ignoreImages', {
      filter: 'img',
      replacement: () => '' // 完全忽略图片
    });

    // 自定义规则：优化表格处理，保持结构化信息
    this.turndownService.addRule('tables', {
      filter: 'table',
      replacement: (content, node) => {
        const rows = Array.from(node.querySelectorAll('tr'));
        if (rows.length === 0) return '';
        
        // 检查是否是有意义的数据表格
        // 如果表格包含太多嵌套表格或过于复杂，就跳过
        const nestedTables = node.querySelectorAll('table');
        if (nestedTables.length > 0) {
          // 跳过包含嵌套表格的复杂表格
          return '';
        }
        
        // 检查是否主要包含图片
        const images = node.querySelectorAll('img');
        const textContent = node.textContent.trim();
        if (images.length > 0 && textContent.length < 50) {
          // 跳过主要是图片的表格
          return '';
        }
        
        let markdown = '\n\n';
        let maxCols = 0;
        
        // 首先确定最大列数
        rows.forEach(row => {
          const cells = Array.from(row.querySelectorAll('td, th'));
          maxCols = Math.max(maxCols, cells.length);
        });
        
        if (maxCols === 0 || maxCols > 10) {
          // 跳过没有列或列数过多的表格
          return '';
        }
        
        let hasValidContent = false;
        
        rows.forEach((row, rowIndex) => {
          const cells = Array.from(row.querySelectorAll('td, th'));
          
          // 检查这一行是否有有效内容
          const rowText = cells.map(cell => cell.textContent.trim()).join('');
          if (!rowText) return; // 跳过空行
          
          hasValidContent = true;
          
          // 构建表格行
          markdown += '| ';
          
          for (let i = 0; i < maxCols; i++) {
            if (i < cells.length) {
              // 获取单元格文本内容，处理换行和空格
              let cellText = cells[i].textContent.trim();
              cellText = cellText.replace(/\s+/g, ' '); // 合并多个空格
              cellText = cellText.replace(/\|/g, '\\|'); // 转义管道符
              // 限制单元格内容长度，避免过长
              if (cellText.length > 20) {
                cellText = cellText.substring(0, 20) + '...';
              }
              markdown += `${cellText} | `;
            } else {
              markdown += ' | '; // 空单元格
            }
          }
          
          markdown += '\n';
          
          // 在第一行后添加分隔线
          if (rowIndex === 0) {
            markdown += '| ';
            for (let i = 0; i < maxCols; i++) {
              markdown += '--- | ';
            }
            markdown += '\n';
          }
        });
        
        if (!hasValidContent) {
          return ''; // 如果没有有效内容，返回空
        }
        
        markdown += '\n';
        return markdown;
      }
    });

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

      // 直接转换为Markdown
      const markdown = this.htmlToMarkdown(contentDiv.innerHTML, params);
      
      return markdown;

    } catch (error) {
      console.error('请求失败:', error);
      throw new Error(`无法连接到测算服务: ${error.message}`);
    }
  }

  htmlToMarkdown(html, params) {
    // 添加主标题
    let title = `# ${params.year}年${params.month}月${params.day}日${params.hour}时${params.minute}分${params.gender}命八字测算打分\n\n`;
    
    // 使用Turndown转换HTML为Markdown，保持原始结构顺序
    const markdown = this.turndownService.turndown(html);
    
    return title + markdown;
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