import axios from 'axios';

/**
 * 格美网八字算命HTTP客户端
 */
export class BaziHttpClient {
  constructor() {
    this.baseUrl = 'http://www.gemei.com';
    this.baziUrl = `${this.baseUrl}/bazi/`;
    this.headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
    };
  }

  /**
   * 提交八字测算表单
   * @param {Object} params - 测算参数
   * @param {number} params.year - 出生年份
   * @param {number} params.month - 出生月份
   * @param {number} params.day - 出生日
   * @param {number} params.hour - 出生时
   * @param {number} params.minute - 出生分
   * @param {number} params.gender - 性别 (1=男, 2=女)
   * @returns {Promise<string>} HTML结果
   */
  async submitBaziForm(params) {
    try {
      const formData = new URLSearchParams({
        y: params.year,
        m: params.month,
        d: params.day,
        h: params.hour,
        i: params.minute,
        sex: params.gender
      });

      const response = await axios.post(this.baziUrl, formData.toString(), {
        headers: this.headers,
        timeout: 10000,
        responseType: 'text'
      });

      return response.data;
    } catch (error) {
      console.error('提交八字表单失败:', error.message);
      throw new Error(`八字测算失败: ${error.message}`);
    }
  }

  /**
   * 获取八字测算页面
   * @returns {Promise<string>} HTML内容
   */
  async getBaziPage() {
    try {
      const response = await axios.get(this.baziUrl, {
        headers: this.headers,
        timeout: 10000,
        responseType: 'text'
      });
      return response.data;
    } catch (error) {
      console.error('获取八字页面失败:', error.message);
      throw new Error(`获取页面失败: ${error.message}`);
    }
  }
}