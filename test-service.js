#!/usr/bin/env node

const { BaziFortuneTellingServer } = require('./bazi-fortune-telling-mcp.js');

// 测试数据 - 使用您的出生信息
const testData = {
  year: "2005",
  month: "1", 
  day: "2",
  hour: "3",
  minute: "4",
  gender: "女"
};

async function testService() {
  console.log('🧪 开始测试八字测算服务...');
  console.log('📊 测试数据:', testData);
  console.log('');
  
  try {
    // 创建服务器实例
    const server = new BaziFortuneTellingServer();
    
    // 直接调用测算方法
    const result = await server.calculateBazi(testData);
    
    console.log('✅ 测试成功！');
    console.log('');
    console.log('📋 测算结果预览:');
    console.log('='.repeat(50));
    console.log(result.substring(0, 1000) + '...');
    console.log('='.repeat(50));
    console.log('');
    console.log('🎉 服务运行正常，可以开始使用了！');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    console.error('详细错误:', error);
  }
}

// 运行测试
testService();