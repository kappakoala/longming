import { BaziHttpClient } from './http-client.js';
import { BaziParser } from './parser.js';

/**
 * 八字算命服务
 */
export class BaziService {
  constructor() {
    this.httpClient = new BaziHttpClient();
    this.parser = new BaziParser();
  }

  /**
   * 进行八字测算
   * @param {Object} params - 测算参数
   * @param {number} params.year - 出生年份
   * @param {number} params.month - 出生月份
   * @param {number} params.day - 出生日
   * @param {number} params.hour - 出生时
   * @param {number} params.minute - 出生分
   * @param {string} params.gender - 性别 (男/女)
   * @returns {Promise<Object>} 测算结果
   */
  async calculateBazi(params) {
    try {
      // 验证参数
      this.validateParams(params);
      
      // 转换性别参数
      const genderCode = params.gender === '男' ? 1 : 2;
      
      // 提交表单
      const html = await this.httpClient.submitBaziForm({
        year: params.year,
        month: params.month,
        day: params.day,
        hour: params.hour,
        minute: params.minute,
        gender: genderCode
      });
      
      // 解析结果
      const result = this.parser.parseBaziResult(html);
      
      return {
        success: true,
        data: result,
        message: '八字测算完成'
      };
      
    } catch (error) {
      console.error('八字测算失败:', error);
      return {
        success: false,
        data: null,
        message: error.message
      };
    }
  }

  /**
   * 验证输入参数
   */
  validateParams(params) {
    const { year, month, day, hour, minute, gender } = params;
    
    if (!year || year < 1900 || year > 2030) {
      throw new Error('年份必须在1900-2030之间');
    }
    
    if (!month || month < 1 || month > 12) {
      throw new Error('月份必须在1-12之间');
    }
    
    if (!day || day < 1 || day > 31) {
      throw new Error('日必须在1-31之间');
    }
    
    if (hour === undefined || hour < 0 || hour > 23) {
      throw new Error('时必须在0-23之间');
    }
    
    if (minute === undefined || minute < 0 || minute > 59) {
      throw new Error('分必须在0-59之间');
    }
    
    if (!gender || !['男', '女'].includes(gender)) {
      throw new Error('性别必须是男或女');
    }
  }

  /**
   * 获取八字测算页面信息
   * @returns {Promise<Object>} 页面信息
   */
  async getBaziPageInfo() {
    try {
      const html = await this.httpClient.getBaziPage();
      return {
        success: true,
        data: {
          title: '八字测算打分',
          description: '基于格美网的八字测算服务',
          available: true
        },
        message: '获取页面信息成功'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message
      };
    }
  }

  /**
   * 格式化八字结果为易读格式
   * @param {Object} result - 测算结果
   * @returns {string} 格式化文本
   */
  formatResult(result) {
    if (!result.success || !result.data) {
      return `测算失败: ${result.message}`;
    }

    const { basicInfo, bazi, wuxing, scores, yongshen, auspicious } = result.data;
    
    let formatted = `=== 八字测算结果 ===\n\n`;
    
    // 基本信息
    if (basicInfo.gender) {
      formatted += `性别: ${basicInfo.gender}\n`;
      formatted += `公历: ${basicInfo.solarDate}\n`;
      formatted += `农历: ${basicInfo.lunarDate}\n\n`;
    }
    
    // 八字
    if (bazi) {
      formatted += `八字: ${bazi.full}\n`;
      formatted += `年柱: ${bazi.year} 月柱: ${bazi.month} 日柱: ${bazi.day} 时柱: ${bazi.hour}\n\n`;
    }
    
    // 五行分析
    if (wuxing) {
      formatted += `=== 五行分析 ===\n`;
      formatted += `火: ${wuxing.values.fire} 土: ${wuxing.values.earth} 金: ${wuxing.values.gold} 水: ${wuxing.values.water} 木: ${wuxing.values.wood}\n`;
      formatted += `旺衰得分: ${wuxing.score}\n`;
      formatted += `喜用五行: ${wuxing.favorable}\n`;
      if (wuxing.missing) {
        formatted += `缺失五行: ${wuxing.missing}\n`;
      }
      formatted += '\n';
    }
    
    // 运势评分
    if (scores && Object.keys(scores).length > 0) {
      formatted += `=== 运势评分 ===\n`;
      for (const [category, data] of Object.entries(scores)) {
        formatted += `${category}: ${data.score}分\n`;
      }
      formatted += '\n';
    }
    
    // 喜用神分析
    if (yongshen) {
      formatted += `=== 喜用神分析 ===\n`;
      formatted += `格局: ${yongshen.pattern}\n`;
      formatted += `用神: ${yongshen.yongshen}\n`;
      formatted += `喜神: ${yongshen.xishen}\n\n`;
    }
    
    // 趋利避凶
    if (auspicious) {
      formatted += `=== 趋利避凶建议 ===\n`;
      formatted += `吉利五行: ${auspicious.wuxing}\n`;
      formatted += `吉利数字: ${auspicious.numbers}\n`;
      formatted += `吉利颜色: ${auspicious.colors}\n`;
      formatted += `有利方位: ${auspicious.directions}\n`;
      formatted += `吉利楼层: ${auspicious.floors}\n`;
      if (auspicious.careers.length > 0) {
        formatted += `适合职业: ${auspicious.careers.join('、')}\n`;
      }
    }
    
    return formatted;
  }
}