import * as cheerio from 'cheerio';

/**
 * 八字HTML解析器
 */
export class BaziParser {
  /**
   * 解析八字测算结果
   * @param {string} html - HTML内容
   * @returns {Object} 解析结果
   */
  parseBaziResult(html) {
    const $ = cheerio.load(html);
    
    return {
      basicInfo: this.parseBasicInfo($),
      bazi: this.parseBazi($),
      wuxing: this.parseWuxing($),
      scores: this.parseScores($),
      yongshen: this.parseYongshen($),
      dayun: this.parseDayun($),
      auspicious: this.parseAuspicious($)
    };
  }

  /**
   * 解析基本信息
   */
  parseBasicInfo($) {
    const basicInfo = {};
    
    // 提取性别和公历时间
    const genderMatch = $('p:contains("男命：")').text();
    if (genderMatch) {
      basicInfo.gender = genderMatch.includes('男命') ? '男' : '女';
      basicInfo.solarDate = genderMatch.match(/公历(.+)/)?.[1] || '';
    }

    // 提取农历时间
    const lunarMatch = $('p:contains("农历：")').text();
    if (lunarMatch) {
      basicInfo.lunarDate = lunarMatch.match(/农历(.+)/)?.[1] || '';
    }

    return basicInfo;
  }

  /**
   * 解析八字
   */
  parseBazi($) {
    const baziText = $('p:contains("八字：")').text();
    const baziMatch = baziText.match(/八字：(.+)/);
    
    if (baziMatch) {
      const [year, month, day, hour] = baziMatch[1].split(' ');
      return {
        year: year.replace('年', ''),
        month: month.replace('月', ''),
        day: day.replace('日', ''),
        hour: hour.replace('时', ''),
        full: baziMatch[1].trim()
      };
    }
    
    return null;
  }

  /**
   * 解析五行分析
   */
  parseWuxing($) {
    const wuxingSection = $('h3:contains("八字五行分析")').next('p');
    const wuxingText = wuxingSection.text();
    
    // 提取五行数值
    const fireMatch = wuxingText.match(/火(\d+)/);
    const earthMatch = wuxingText.match(/土(\d+)/);
    const goldMatch = wuxingText.match(/金(\d+)/);
    const waterMatch = wuxingText.match(/水(\d+)/);
    const woodMatch = wuxingText.match(/木(\d+)/);
    
    // 提取得分
    const scoreMatch = wuxingText.match(/五行旺衰综合修正后得分:<b>(-?\d+)<\/b>/);
    
    // 提取喜用五行
    const favorableMatch = wuxingText.match(/你的八字五行喜：<b>([^<]+)<\/b>/);
    
    // 提取缺失五行
    const missingMatch = wuxingText.match(/命主八字五行<b>缺([^<]+)<\/b>/);
    
    return {
      values: {
        fire: fireMatch ? parseInt(fireMatch[1]) : 0,
        earth: earthMatch ? parseInt(earthMatch[1]) : 0,
        gold: goldMatch ? parseInt(goldMatch[1]) : 0,
        water: waterMatch ? parseInt(waterMatch[1]) : 0,
        wood: woodMatch ? parseInt(woodMatch[1]) : 0
      },
      score: scoreMatch ? parseInt(scoreMatch[1]) : 0,
      favorable: favorableMatch ? favorableMatch[1].trim() : '',
      missing: missingMatch ? missingMatch[1].trim() : ''
    };
  }

  /**
   * 解析运势评分
   */
  parseScores($) {
    const scores = {};
    
    // 查找评分表格
    $('table:contains("财富") tr').each((i, row) => {
      const $row = $(row);
      const categoryCell = $row.find('td').first();
      const scoreCell = $row.find('span');
      
      if (categoryCell && scoreCell.length > 0) {
        const category = categoryCell.text().trim();
        const scoreText = scoreCell.text().trim();
        const scoreMatch = scoreText.match(/(\d+)分/);
        
        if (scoreMatch && ['财富', '事业', '学业', '婚姻', '交际', '机遇', '运势'].includes(category)) {
          scores[category] = {
            score: parseInt(scoreMatch[1]),
            fullText: scoreText
          };
        }
      }
    });
    
    return scores;
  }

  /**
   * 解析喜用神分析
   */
  parseYongshen($) {
    const yongshenSection = $('h3:contains("喜神用神分析")').next('p');
    const yongshenText = yongshenSection.text();
    
    // 提取格局
    const patternMatch = yongshenText.match(/命主生辰<b>([^<]+)<\/b>/);
    
    // 提取用神
    const yongshenMatch = yongshenText.match(/实用神为 <b>([^<]+)<\/b>/);
    
    // 提取喜神
    const xishenMatch = yongshenText.match(/「喜神」是 <b>([^<]+)<\/b>/);
    
    return {
      pattern: patternMatch ? patternMatch[1].trim() : '',
      yongshen: yongshenMatch ? yongshenMatch[1].trim() : '',
      xishen: xishenMatch ? xishenMatch[1].trim() : '',
      description: yongshenText.trim()
    };
  }

  /**
   * 解析大运
   */
  parseDayun($) {
    const dayunSection = $('h3:contains("八字大运分析")').next('p');
    const dayunText = dayunSection.text();
    
    // 提取大运信息
    const dayunList = [];
    const lines = dayunText.split('\n');
    
    for (const line of lines) {
      const match = line.match(/(\d+)岁\s+(\d+)年\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)/);
      if (match) {
        dayunList.push({
          age: parseInt(match[1]),
          year: parseInt(match[2]),
          ganzhi: match[3],
          tianshen: match[4],
        });
      }
    }
    
    return {
      startAge: this.extractStartAge(dayunText),
      dayunList: dayunList
    };
  }

  /**
   * 解析趋利避凶建议
   */
  parseAuspicious($) {
    const auspiciousSection = $('h3:contains("趋利避凶吉言")').next('p');
    const auspiciousText = auspiciousSection.text();
    
    const result = {
      wuxing: '',
      numbers: '',
      colors: '',
      directions: '',
      floors: '',
      careers: []
    };
    
    const lines = auspiciousText.split('\n');
    for (const line of lines) {
      if (line.includes('吉利五行：')) {
        result.wuxing = line.split('：')[1]?.trim() || '';
      } else if (line.includes('吉利数字：')) {
        result.numbers = line.split('：')[1]?.trim() || '';
      } else if (line.includes('吉利颜色：')) {
        result.colors = line.split('：')[1]?.trim() || '';
      } else if (line.includes('有利方位：')) {
        result.directions = line.split('：')[1]?.trim() || '';
      } else if (line.includes('吉利楼层：')) {
        result.floors = line.split('：')[1]?.trim() || '';
      } else if (line.includes('适合职业：')) {
        result.careers = line.split('：')[1]?.split('、').map(c => c.trim()) || [];
      }
    }
    
    return result;
  }

  /**
   * 提取起运年龄
   */
  extractStartAge(text) {
    const match = text.match(/从(\d+)岁/);
    return match ? parseInt(match[1]) : 0;
  }
}