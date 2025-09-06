import { BaziService } from './bazi-service.js';

/**
 * 测试八字算命服务
 */
async function testBaziService() {
  console.log('=== 开始测试八字算命服务 ===\n');
  
  const baziService = new BaziService();
  
  // 测试参数 - 用户提供的出生信息
  const testParams = {
    year: 1984,
    month: 10,
    day: 21,
    hour: 20,
    minute: 30,
    gender: '男'
  };
  
  console.log('测试参数:', testParams);
  console.log();
  
  try {
    // 1. 测试获取页面信息
    console.log('1. 测试获取页面信息...');
    const pageInfo = await baziService.getBaziPageInfo();
    console.log('页面信息:', JSON.stringify(pageInfo, null, 2));
    console.log();
    
    // 2. 测试八字测算
    console.log('2. 测试八字测算...');
    const result = await baziService.calculateBazi(testParams);
    console.log('测算结果:', JSON.stringify(result, null, 2));
    console.log();
    
    // 3. 测试格式化结果
    if (result.success) {
      console.log('3. 测试格式化结果...');
      const formatted = baziService.formatResult(result);
      console.log('格式化结果:');
      console.log(formatted);
      console.log();
    }
    
    console.log('=== 测试完成 ===');
    
  } catch (error) {
    console.error('测试失败:', error.message);
    console.error(error.stack);
  }
}

// 运行测试
testBaziService();