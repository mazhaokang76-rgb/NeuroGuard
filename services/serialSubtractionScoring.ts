// services/serialSubtractionScoring.ts

/**
 * 专门处理连续减7评分的函数
 * MMSE 连续减7评分规则：
 * - 如果当前答案正确（与标准答案一致），得1分
 * - 如果当前答案错误，但正确地从上一个答案减去7，也得1分（连续减法规则）
 */

export interface SerialSubtractionAnswer {
  questionId: string;
  answer: string;
  standardAnswer: number; // 标准答案（93, 86, 79, 72, 65）
}

/**
 * 评估连续减7的单个答案
 * @param currentAnswer 当前答案
 * @param previousAnswer 上一题的答案（可能为null，如果是第一题）
 * @param standardAnswer 标准正确答案
 * @returns 0 或 1
 */
export function scoreSerialSubtraction(
  currentAnswer: string,
  previousAnswer: string | null,
  standardAnswer: number
): { score: number; reasoning: string } {
  // 清理和解析当前答案
  const currentNum = parseAnswerToNumber(currentAnswer);
  
  if (currentNum === null) {
    return { score: 0, reasoning: '无法识别的数字格式' };
  }

  // 检查是否与标准答案一致
  if (currentNum === standardAnswer) {
    return { score: 1, reasoning: `正确：${currentNum}` };
  }

  // 如果有前一个答案，检查是否正确减去了7
  if (previousAnswer !== null) {
    const previousNum = parseAnswerToNumber(previousAnswer);
    
    if (previousNum !== null) {
      const expectedFromPrevious = previousNum - 7;
      
      if (currentNum === expectedFromPrevious) {
        return { 
          score: 1, 
          reasoning: `连续减法正确：${previousNum} - 7 = ${currentNum}（虽然标准答案是${standardAnswer}）` 
        };
      }
    }
  }

  return { 
    score: 0, 
    reasoning: `错误：回答${currentNum}，标准答案是${standardAnswer}` 
  };
}

/**
 * 将答案字符串转换为数字
 * 支持：数字、中文数字、包含数字的字符串
 */
function parseAnswerToNumber(answer: string): number | null {
  if (!answer) return null;

  // 移除空格和标点
  const cleaned = answer.trim().replace(/[，。、\s]/g, '');

  // 尝试直接解析数字
  const directNum = parseInt(cleaned, 10);
  if (!isNaN(directNum)) {
    return directNum;
  }

  // 尝试解析中文数字
  const chineseNum = parseChineseNumber(cleaned);
  if (chineseNum !== null) {
    return chineseNum;
  }

  // 尝试提取字符串中的数字
  const match = cleaned.match(/\d+/);
  if (match) {
    return parseInt(match[0], 10);
  }

  return null;
}

/**
 * 解析中文数字
 */
function parseChineseNumber(str: string): number | null {
  const chineseNumerals: Record<string, number> = {
    '零': 0, '一': 1, '二': 2, '三': 3, '四': 4,
    '五': 5, '六': 6, '七': 7, '八': 8, '九': 9,
    '十': 10, '百': 100
  };

  // 简单的两位数解析（如"八十六"）
  if (str.includes('十')) {
    let result = 0;
    const parts = str.split('十');
    
    // 前面的数字（十位）
    if (parts[0] && parts[0] !== '') {
      result += (chineseNumerals[parts[0]] || 1) * 10;
    } else {
      result += 10; // "十X" 表示 10+X
    }
    
    // 后面的数字（个位）
    if (parts[1] && parts[1] !== '') {
      result += chineseNumerals[parts[1]] || 0;
    }
    
    return result;
  }

  // 单个数字
  if (chineseNumerals[str] !== undefined) {
    return chineseNumerals[str];
  }

  return null;
}

/**
 * 批量评估连续减7的所有答案
 */
export function scoreAllSerialSubtractions(
  answers: Record<string, string>
): Record<string, { score: number; reasoning: string }> {
  const results: Record<string, { score: number; reasoning: string }> = {};
  
  const questionIds = [
    'mmse_serial7_1',
    'mmse_serial7_2', 
    'mmse_serial7_3',
    'mmse_serial7_4',
    'mmse_serial7_5'
  ];
  
  const standardAnswers = [93, 86, 79, 72, 65];
  
  questionIds.forEach((id, index) => {
    const currentAnswer = answers[id];
    const previousAnswer = index > 0 ? answers[questionIds[index - 1]] : null;
    const standardAnswer = standardAnswers[index];
    
    if (currentAnswer) {
      results[id] = scoreSerialSubtraction(
        currentAnswer,
        previousAnswer,
        standardAnswer
      );
    } else {
      results[id] = { score: 0, reasoning: '未作答' };
    }
  });
  
  return results;
}

/**
 * MoCA 的连续减7也使用相同逻辑
 */
export function scoreMocaSerialSubtraction(
  audioTranscript: string
): { score: number; reasoning: string } {
  // 从转录中提取5个数字
  const numbers = extractNumbersFromText(audioTranscript);
  
  if (numbers.length < 5) {
    return { 
      score: 0, 
      reasoning: `只识别出${numbers.length}个数字，需要5个` 
    };
  }

  const standardAnswers = [93, 86, 79, 72, 65];
  let correctCount = 0;
  const details: string[] = [];

  for (let i = 0; i < 5; i++) {
    const current = numbers[i];
    const standard = standardAnswers[i];
    
    // 检查是否与标准答案一致
    if (current === standard) {
      correctCount++;
      details.push(`✓${current}`);
    } 
    // 检查是否正确地从上一个答案减7
    else if (i > 0 && current === numbers[i - 1] - 7) {
      correctCount++;
      details.push(`✓${current}(续减)`);
    } 
    else {
      details.push(`✗${current}`);
    }
  }

  // MoCA 评分：4-5个正确=3分，2-3个正确=2分，1个正确=1分
  let score = 0;
  if (correctCount >= 4) score = 3;
  else if (correctCount >= 2) score = 2;
  else if (correctCount >= 1) score = 1;

  return {
    score,
    reasoning: `说出${numbers.join(', ')}，正确${correctCount}个：${details.join(' ')}`
  };
}

/**
 * 从文本中提取数字序列
 */
function extractNumbersFromText(text: string): number[] {
  const numbers: number[] = [];
  
  // 匹配连续的数字或中文数字
  const segments = text.split(/[，。、\s,.\n]/);
  
  for (const segment of segments) {
    const num = parseAnswerToNumber(segment);
    if (num !== null && num >= 0 && num <= 100) {
      numbers.push(num);
    }
  }
  
  return numbers.slice(0, 5); // 只取前5个
}
