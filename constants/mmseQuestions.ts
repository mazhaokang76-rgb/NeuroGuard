// constants/mmseQuestions.ts
import { AssessmentType, Question, QuestionInputType } from '../types';

// 辅助函数：根据月份和纬度判断季节
const getCurrentSeason = (): string => {
  const month = new Date().getMonth() + 1; // 1-12
  
  // 简化判断：假设北半球
  // 可以根据获取的地理位置纬度进一步优化
  if (month >= 3 && month <= 5) return '春季/春天/spring';
  if (month >= 6 && month <= 8) return '夏季/夏天/summer';
  if (month >= 9 && month <= 11) return '秋季/秋天/autumn/fall';
  return '冬季/冬天/winter';
};

// 生成季节判断的 Grok 提示
const getSeasonPrompt = (): string => {
  const month = new Date().getMonth() + 1;
  const season = getCurrentSeason();
  const seasons = season.split('/');
  
  return `Current month: ${month}月. Current season in Northern Hemisphere: ${season}. Check if answer matches any of: ${seasons.join(', ')}. Return ONLY: {"score": 1, "reasoning": "正确"} or {"score": 0, "reasoning": "错误，当前应该是${seasons[0]}"}`;
};

// 生成当前日期信息
const getCurrentDateInfo = () => {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    date: now.getDate(),
    day: now.getDay(),
    dayName: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'][now.getDay()],
    dayNameShort: ['周日','周一','周二','周三','周四','周五','周六'][now.getDay()],
    monthName: ['January','February','March','April','May','June','July','August','September','October','November','December'][now.getMonth()],
    monthNameCN: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'][now.getMonth()]
  };
};

export const MMSE_QUESTIONS: Question[] = [
  // 定向力 - 时间 (5分)
  {
    id: 'mmse_time_year',
    assessmentType: AssessmentType.MMSE,
    category: '定向力-时间',
    text: '今年是哪一年？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: `${getCurrentDateInfo().year}年`,
    grokPrompt: `Current year: ${getCurrentDateInfo().year}. Check if answer is ${getCurrentDateInfo().year} (accept: ${getCurrentDateInfo().year}, ${getCurrentDateInfo().year}年, Chinese number format and reasonable variety (e.g., 25 vs 2025)). Return ONLY: {"score": 1, "reasoning": "正确"} or {"score": 0, "reasoning": "错误，今年是${getCurrentDateInfo().year}年"}`
  },
  
  {
    id: 'mmse_time_season',
    assessmentType: AssessmentType.MMSE,
    category: '定向力-时间',
    text: '现在是什么季节？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: getCurrentSeason().split('/')[0],
    grokPrompt: getSeasonPrompt()
  },
  
  {
    id: 'mmse_time_month',
    assessmentType: AssessmentType.MMSE,
    category: '定向力-时间',
    text: '现在是几月份？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: `${getCurrentDateInfo().month}月`,
    grokPrompt: `Current month: ${getCurrentDateInfo().month} (${getCurrentDateInfo().monthName} / ${getCurrentDateInfo().monthNameCN}). Check if answer is ${getCurrentDateInfo().month} (accept: ${getCurrentDateInfo().month}, ${getCurrentDateInfo().month}月, ${getCurrentDateInfo().monthNameCN}, ${getCurrentDateInfo().monthName}). Return ONLY: {"score": 1, "reasoning": "正确"} or {"score": 0, "reasoning": "错误，现在是${getCurrentDateInfo().month}月"}`
  },
  
  {
    id: 'mmse_time_date',
    assessmentType: AssessmentType.MMSE,
    category: '定向力-时间',
    text: '今天是几号？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: `${getCurrentDateInfo().date}号（±1天可接受）`,
    grokPrompt: `Current date: ${getCurrentDateInfo().year}-${getCurrentDateInfo().month}-${getCurrentDateInfo().date}. Today is ${getCurrentDateInfo().date}号. Check if answer is within ±1 day. Accept: ${getCurrentDateInfo().date-1}, ${getCurrentDateInfo().date}, ${getCurrentDateInfo().date+1} (with or without 号/日). Return ONLY: {"score": 1, "reasoning": "正确"} or {"score": 0, "reasoning": "错误，今天是${getCurrentDateInfo().date}号"}`
  },
  
  {
    id: 'mmse_time_day',
    assessmentType: AssessmentType.MMSE,
    category: '定向力-时间',
    text: '今天是星期几？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: getCurrentDateInfo().dayName,
    grokPrompt: `Today is ${new Date().toLocaleDateString('en-US', {weekday: 'long'})} (${getCurrentDateInfo().dayName} / ${getCurrentDateInfo().dayNameShort}). Check if answer matches current day of week  or reasonable variation (e.g.,礼拜一， 周一，一，1 vs 星期一). Accept: ${getCurrentDateInfo().dayName}, ${getCurrentDateInfo().dayNameShort}, ${new Date().toLocaleDateString('en-US', {weekday: 'long'})}, 礼拜${getCurrentDateInfo().day === 0 ? '日' : getCurrentDateInfo().day}. Return ONLY: {"score": 1, "reasoning": "正确"} or {"score": 0, "reasoning": "错误，今天是${getCurrentDateInfo().dayName}"}`
  },

  // 定向力 - 地点 (5分)
  {
    id: 'mmse_place_province',
    assessmentType: AssessmentType.MMSE,
    category: '定向力-地点',
    text: '您住在哪个省？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '根据设备位置判断',
    grokPrompt: `Check if answer is a reasonable Chinese province/state name. If user location is provided in context (format: 【用户位置信息】), verify if answer matches or is close to the actual province. Accept: exact match or reasonable variation (e.g., 江苏 vs 江苏省). If no location info, accept any valid province name. Return ONLY: {"score": 1, "reasoning": "省份合理"} or {"score": 0, "reasoning": "不合理或与实际位置不符"}`
  },
  
  {
    id: 'mmse_place_city',
    assessmentType: AssessmentType.MMSE,
    category: '定向力-地点',
    text: '您住在什么市（区县）？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '根据设备位置判断',
    grokPrompt: `Check if answer is a reasonable city/district name. If user location is provided in context, verify if answer matches or is close to the actual city. Accept: exact match or reasonable variation (e.g., 南京 vs 南京市). If no location info, accept any valid city name. Return ONLY: {"score": 1, "reasoning": "城市合理"} or {"score": 0, "reasoning": "不合理或与实际位置不符"}`
  },
  
  {
    id: 'mmse_place_street',
    assessmentType: AssessmentType.MMSE,
    category: '定向力-地点',
    text: '您住在什么街道？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '根据设备位置判断',
    grokPrompt: `Check if answer is a reasonable street/area/district name. If user location shows district info in context, consider if answer is consistent. Accept any reasonable street name or "不知道具体街道" as valid (score 1) since exact street is hard to recall. Return ONLY: {"score": 1, "reasoning": "街道名称合理"} or {"score": 0, "reasoning": "明显不合理"}`
  },
  
  {
    id: 'mmse_place_location',
    assessmentType: AssessmentType.MMSE,
    category: '定向力-地点',
    text: '咱们现在在什么地方？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '医院/家里/诊所等合理地点',
    grokPrompt: `Check if answer is a reasonable current location type: hospital (医院), home (家里/家中), clinic (诊所), doctor's office (医务室), rehabilitation center (康复中心), community health center (社区卫生服务中心), or specific place name. Accept general descriptions like "在家" or "医院". Return ONLY: {"score": 1, "reasoning": "地点描述合理"} or {"score": 0, "reasoning": "不合理"}`
  },
  
  {
    id: 'mmse_place_floor',
    assessmentType: AssessmentType.MMSE,
    category: '定向力-地点',
    text: '咱们现在在第几层楼？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '任何合理的楼层数',
    grokPrompt: `Check if answer is a reasonable floor number: 1-99 floor, ground floor (一楼/底楼/一层), or "不清楚楼层" (accept as 1 point since hard to know exact floor). Accept: 数字, 一楼/二楼/三楼, 1层/2层, 1F/2F, ground floor, first floor, etc. Return ONLY: {"score": 1, "reasoning": "楼层合理"} or {"score": 0, "reasoning": "不合理"}`
  },

  // 记忆力 - 即刻记忆 (3分)
  {
    id: 'mmse_memory_immediate',
    assessmentType: AssessmentType.MMSE,
    category: '记忆力',
    text: '记忆三个词：皮球、国旗、树木',
    subText: '请重复这三个词',
    inputType: QuestionInputType.AUDIO,
    maxScore: 3,
    answerKey: '皮球、国旗、树木',
    grokPrompt: 'Transcribe the audio carefully. Count how many of these  words are mentioned: 皮球, 国旗, 树木 or 数目. Each correct word = 1 point. Accept slight pronunciation variations but NOT synonyms (e.g., 球 ≠ 皮球, 旗 ≠ 国旗). Return ONLY: {"score": <0-3>, "reasoning": "说出了X个：[列出具体说的词]"}''  },

  // 注意力和计算力 (5分)
  {
    id: 'mmse_serial7_1',
    assessmentType: AssessmentType.MMSE,
    category: '注意力和计算力',
    text: '100减7等于多少？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '93',
    grokPrompt: 'Check if answer is exactly 93. Accept: 93, 九十三, ninety-three. Return ONLY: {"score": 1, "reasoning": "正确"} or {"score": 0, "reasoning": "错误，应该是93"}'
  },
  
  {
    id: 'mmse_serial7_2',
    assessmentType: AssessmentType.MMSE,
    category: '注意力和计算力',
    text: '再减7是多少？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '86',
    grokPrompt: 'Check if answer is 86. If previous answer was wrong, score based on correct subtraction from their previous answer (serial subtraction scoring). Accept: 86, 八十六. Return ONLY: {"score": 1, "reasoning": "正确"} or {"score": 0, "reasoning": "错误"}'
  },
  
  {
    id: 'mmse_serial7_3',
    assessmentType: AssessmentType.MMSE,
    category: '注意力和计算力',
    text: '再减7是多少？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '79',
    grokPrompt: 'Check if answer is 79 OR if they correctly subtracted 7 from their previous answer (even if previous was wrong). Serial subtraction scoring. Return ONLY: {"score": 1, "reasoning": "正确"} or {"score": 0, "reasoning": "错误"}'
  },
  
  {
    id: 'mmse_serial7_4',
    assessmentType: AssessmentType.MMSE,
    category: '注意力和计算力',
    text: '再减7是多少？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '72',
    grokPrompt: 'Check if answer is 72 OR correctly subtracted 7 from previous answer. Serial subtraction scoring. Return ONLY: {"score": 1, "reasoning": "正确"} or {"score": 0, "reasoning": "错误"}'
  },
  
  {
    id: 'mmse_serial7_5',
    assessmentType: AssessmentType.MMSE,
    category: '注意力和计算力',
    text: '最后再减7是多少？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '65',
    grokPrompt: 'Check if answer is 65 OR correctly subtracted 7 from previous answer. Serial subtraction scoring. Return ONLY: {"score": 1, "reasoning": "正确"} or {"score": 0, "reasoning": "错误"}'
  },

  // 回忆能力 (3分)
  {
    id: 'mmse_memory_recall',
    assessmentType: AssessmentType.MMSE,
    category: '回忆能力',
    text: '词语回忆',
    subText: '请回忆刚才的三个词',
    inputType: QuestionInputType.AUDIO,
    maxScore: 3,
    answerKey: '皮球、国旗、树木',
    grokPrompt: 'Transcribe audio carefully. Count how many of these EXACT words are recalled: 皮球, 国旗, 树木. Each correct recall = 1 point. Must be spontaneous recall without prompting. Accept pronunciation variations but NOT synonyms. Return ONLY: {"score": <0-3>, "reasoning": "回忆出X个：[列出具体词]"}'
  },

  // 语言能力 - 命名 (2分)
  {
    id: 'mmse_naming_watch',
    assessmentType: AssessmentType.MMSE,
    category: '语言能力-命名',
    text: '看图命名：这是什么？',
    imageReference: '/pics/watch.jpg',
    inputType: QuestionInputType.AUDIO,
    maxScore: 1,
    answerKey: '手表/表',
    grokPrompt: 'Transcribe audio. Check if says watch/wristwatch (accept: 手表, 表, 腕表, watch, wristwatch). Do NOT accept: 钟, clock, 闹钟. Return ONLY: {"score": 1, "reasoning": "正确"} or {"score": 0, "reasoning": "错误，说的是..."}'
  },
  
  {
    id: 'mmse_naming_pen',
    assessmentType: AssessmentType.MMSE,
    category: '语言能力-命名',
    text: '看图命名：这是什么？',
    imageReference: '/pics/pen.jpg',
    inputType: QuestionInputType.AUDIO,
    maxScore: 1,
    answerKey: '钢笔/笔',
    grokPrompt: 'Transcribe audio. Check if says pen (accept: 钢笔, 笔, 圆珠笔, 水笔, 签字笔, pen, ballpoint pen). Do NOT accept overly generic like: 东西, 工具. Return ONLY: {"score": 1, "reasoning": "正确"} or {"score": 0, "reasoning": "错误，说的是..."}'
  },

  // 语言能力 - 复述 (1分)
  {
    id: 'mmse_repeat',
    assessmentType: AssessmentType.MMSE,
    category: '语言能力-复述',
    text: '复述："四十四只石狮子"',
    inputType: QuestionInputType.AUDIO,
    maxScore: 1,
    answerKey: '四十四只石狮子',
    grokPrompt: 'Transcribe audio carefully. Check if EXACTLY repeats: 四十四只石狮子. Accept slight tone variations but NOT: 四十四个, 石头狮子, accept same pronunciation: 44只，柿子，etc. Return ONLY: {"score": 1, "reasoning": "准确复述"} or {"score": 0, "reasoning": "不准确，说的是..."}''  },

  // 语言能力 - 阅读 (1分)
  {
    id: 'mmse_read',
    assessmentType: AssessmentType.MMSE,
    category: '语言能力-阅读',
    text: '阅读并执行："闭上你的眼睛"',
    inputType: QuestionInputType.AUDIO,
    maxScore: 1,
    answerKey: '朗读并闭眼',
    grokPrompt: 'Transcribe audio. Check if user: (1) reads aloud "闭上你的眼睛" or describes reading it, AND (2) mentions closing eyes or executing the action. Must demonstrate both reading comprehension and execution. Return ONLY: {"score": 1, "reasoning": "已读并执行"} or {"score": 0, "reasoning": "未完成阅读或执行"}'
  },

  // 语言能力 - 三步命令 (3分)
  {
    id: 'mmse_command',
    assessmentType: AssessmentType.MMSE,
    category: '语言能力-三步命令',
    text: '三步命令：用右手拿纸，对折，放左腿上',
    inputType: QuestionInputType.AUDIO,
    maxScore: 3,
    answerKey: '(1)右手拿 (2)对折 (3)放左腿',
    grokPrompt: 'Transcribe audio. Check if user describes completing these steps: (1) Take paper with RIGHT hand (用右手拿), (2) Fold it (对折/折叠), (3) Place on LEFT leg/thigh (放左腿上). Each completed step = 1 point. Must explicitly mention right hand and left leg. Return ONLY: {"score": <0-3>, "reasoning": "完成X步：[列出完成的步骤]"}'
  },

  // 语言能力 - 书写 (1分)
  {
    id: 'mmse_write',
    assessmentType: AssessmentType.MMSE,
    category: '语言能力-书写',
    text: '写一个完整句子（拍照上传）',
    inputType: QuestionInputType.DRAWING,
    maxScore: 1,
    answerKey: '有主语和谓语的完整句子',
    grokPrompt: 'Analyze the image. Check if it shows a complete Chinese sentence with: (1) Subject (主语), (2) Predicate/Verb (谓语). Sentence must be meaningful and grammatically complete. Accept any complete sentence. Ignore spelling/writing quality. Return ONLY: {"score": 1, "reasoning": "完整句子"} or {"score": 0, "reasoning": "不完整，缺少..."}'
  },

  // 结构能力 (1分)
  {
    id: 'mmse_copy_pentagon',
    assessmentType: AssessmentType.MMSE,
    category: '结构能力',
    text: '临摹两个相交的五边形',
    imageReference: '/pics/pentagons.png',
    inputType: QuestionInputType.DRAWING,
    maxScore: 1,
    answerKey: '两个五边形相交形成四边形',
    grokPrompt: 'Analyze the drawing image carefully. Scoring criteria: (1) Two distinct pentagons (五边形) - each must have 5 sides, (2) They must INTERSECT/OVERLAP (相交), (3) The intersection should form a quadrilateral (四边形). Minor drawing imperfections OK, but structure must be recognizable. Return ONLY: {"score": 1, "reasoning": "符合要求"} or {"score": 0, "reasoning": "不符合，因为..."}'
  }
];

export const MMSE_MAX_SCORE = 30;
export const MMSE_NORMAL_CUTOFF = 27;
