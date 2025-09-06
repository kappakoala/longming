#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { BaziService } from './bazi-service.js';

// 创建MCP服务器
const server = new Server(
  {
    name: "bazi-fortune-telling",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 创建八字服务实例
const baziService = new BaziService();

// 工具列表
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "calculate_bazi",
        description: "进行八字算命测算",
        inputSchema: {
          type: "object",
          properties: {
            year: {
              type: "number",
              description: "出生年份 (1900-2030)",
              minimum: 1900,
              maximum: 2030
            },
            month: {
              type: "number",
              description: "出生月份 (1-12)",
              minimum: 1,
              maximum: 12
            },
            day: {
              type: "number",
              description: "出生日 (1-31)",
              minimum: 1,
              maximum: 31
            },
            hour: {
              type: "number",
              description: "出生时 (0-23)",
              minimum: 0,
              maximum: 23
            },
            minute: {
              type: "number",
              description: "出生分 (0-59)",
              minimum: 0,
              maximum: 59
            },
            gender: {
              type: "string",
              description: "性别",
              enum: ["男", "女"]
            }
          },
          required: ["year", "month", "day", "hour", "minute", "gender"]
        }
      },
      {
        name: "get_bazi_info",
        description: "获取八字测算服务信息",
        inputSchema: {
          type: "object",
          properties: {}
        }
      },
      {
        name: "format_bazi_result",
        description: "格式化八字测算结果",
        inputSchema: {
          type: "object",
          properties: {
            result: {
              type: "object",
              description: "八字测算结果对象"
            }
          },
          required: ["result"]
        }
      }
    ]
  };
});

// 工具调用处理
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "calculate_bazi": {
        const result = await baziService.calculateBazi(args);
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      }

      case "get_bazi_info": {
        const info = await baziService.getBaziPageInfo();
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(info, null, 2)
            }
          ]
        };
      }

      case "format_bazi_result": {
        const formatted = baziService.formatResult(args.result);
        
        return {
          content: [
            {
              type: "text",
              text: formatted
            }
          ]
        };
      }

      default:
        throw new Error(`未知工具: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `错误: ${error.message}`
        }
      ],
      isError: true
    };
  }
});

// 启动服务器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("八字算命MCP服务已启动");
}

main().catch((error) => {
  console.error("启动MCP服务失败:", error);
  process.exit(1);
});