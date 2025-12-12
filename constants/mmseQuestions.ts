import { AssessmentType, Question, QuestionInputType } from '../types';

export const MMSE_QUESTIONS: Question[] = [
  // 定向力 - 时间 (5分)
  {
    id: 'mmse_time_year',
    assessmentType: AssessmentType.MMSE,
    category: '定向力-时间',
    text: '今年是哪一年？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '2025年',
    grokPrompt: 'Check if answer is 2025 (accept: 2025, 2025年, 二零二五). Return ONLY: {"score": 1, "reasoning": "正确"} or {"score": 0, "reasoning": "错误"}'
  },
  {
    id: 'mmse_time_season',
    assessmentType: AssessmentType.MMSE,
    category: '定向力-时间',
    text: '现在是什么季节？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '冬季/冬天',
    grokPrompt: 'Check if answer is winter (accept: 冬季, 冬天, winter, 冬). Return ONLY: {"score": 1, "reasoning": "正确"} or {"score": 0, "reasoning": "错误"}'
  },
  {
    id: 'mmse_time_month',
    assessmentType: AssessmentType.MMSE,
    category: '定向力-时间',
    text: '现在是几月份？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '12月',
    grokPrompt: 'Check if answer is December (accept: 12, 12月, 十二月, December). Return ONLY: {"score": 1, "reasoning": "正确"} or {"score": 0, "reasoning": "错误"}'
  },
  {
    id: 'mmse_time_date',
    assessmentType: AssessmentType.MMSE,
    category: '定向力-时间',
    text: '今天是几号？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '当天日期（±1天可接受）',
    grokPrompt: `Current date: ${new Date().toLocaleDateString('zh-CN')}. Today is day ${new Date().getDate()}. Check if answer is within ±1 day. Accept: ${new Date().getDate()-1}, ${new Date().getDate()}, ${new Date().getDate()+1}. Return ONLY: {"score": 1, "reasoning": "正确"} or {"score": 0, "reasoning": "错误"}`
  },
  {
    id: 'mmse_time_day',
    assessmentType: AssessmentType.MMSE,
    category: '定向力-时间',
    text: '今天是星期几？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '星期三',
    grokPrompt: `Today is ${new Date().toLocaleDateString('en-US', {weekday: 'long'})} (${['星期日','星期一','星期二','星期三','星期四','星期五','星期六'][new Date().getDay()]}). Check if answer matches current day of week. Accept Chinese (星期X/周X/礼拜X) or English. Return ONLY: {"score": 1, "reasoning": "正确"} or {"score": 0, "reasoning": "错误"}`
  },

  // 定向力 - 地点 (5分)
  {
    id: 'mmse_place_province',
    assessmentType: AssessmentType.MMSE,
    category: '定向力-地点',
    text: '您住在哪个省？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '任何合理的省份名称',
    grokPrompt: 'Check if answer is a reasonable Chinese province/state name. Return ONLY: {"score": 1, "reasoning": "合理"} or {"score": 0, "reasoning": "不合理"}'
  },
  {
    id: 'mmse_place_city',
    assessmentType: AssessmentType.MMSE,
    category: '定向力-地点',
    text: '您住在什么市（区县）？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '任何合理的城市名',
    grokPrompt: 'Check if answer is a reasonable city/district name. Return ONLY: {"score": 1, "reasoning": "合理"} or {"score": 0, "reasoning": "不合理"}'
  },
  {
    id: 'mmse_place_street',
    assessmentType: AssessmentType.MMSE,
    category: '定向力-地点',
    text: '您住在什么街道？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '任何合理的街道名',
    grokPrompt: 'Check if answer is a reasonable street/area name. Return ONLY: {"score": 1, "reasoning": "合理"} or {"score": 0, "reasoning": "不合理"}'
  },
  {
    id: 'mmse_place_location',
    assessmentType: AssessmentType.MMSE,
    category: '定向力-地点',
    text: '咱们现在在什么地方？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '医院/家里/诊所等',
    grokPrompt: 'Check if answer is a reasonable location (hospital, clinic, home, etc). Return ONLY: {"score": 1, "reasoning": "合理"} or {"score": 0, "reasoning": "不合理"}'
  },
  {
    id: 'mmse_place_floor',
    assessmentType: AssessmentType.MMSE,
    category: '定向力-地点',
    text: '咱们现在在第几层楼？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '任何楼层数',
    grokPrompt: 'Check if answer is a reasonable floor number. Return ONLY: {"score": 1, "reasoning": "合理"} or {"score": 0, "reasoning": "不合理"}'
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
    grokPrompt: 'Transcribe audio. Count words from list: 皮球, 国旗, 树木. Return ONLY: {"score": <0-3>, "reasoning": "说出了X个：[列出]"}'
  },

  // 注意力和计算力 (5分)
  {
    id: 'mmse_serial7_1',
    assessmentType: AssessmentType.MMSE,
    category: '注意力和计算力',
    text: '100减7等于多少？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '93',
    grokPrompt: 'Check if answer is 93. Return ONLY: {"score": 1, "reasoning": "正确"} or {"score": 0, "reasoning": "错误"}'
  },
  {
    id: 'mmse_serial7_2',
    assessmentType: AssessmentType.MMSE,
    category: '注意力和计算力',
    text: '再减7是多少？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '86',
    grokPrompt: 'Check if answer is 86 OR if previous was wrong but this calculation is correct. Return ONLY: {"score": 1, "reasoning": "正确"} or {"score": 0, "reasoning": "错误"}'
  },
  {
    id: 'mmse_serial7_3',
    assessmentType: AssessmentType.MMSE,
    category: '注意力和计算力',
    text: '再减7是多少？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '79',
    grokPrompt: 'Check if answer is 79 OR continues correct subtraction pattern. Return ONLY: {"score": 1, "reasoning": "正确"} or {"score": 0, "reasoning": "错误"}'
  },
  {
    id: 'mmse_serial7_4',
    assessmentType: AssessmentType.MMSE,
    category: '注意力和计算力',
    text: '再减7是多少？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '72',
    grokPrompt: 'Check if answer is 72 OR continues correct subtraction pattern. Return ONLY: {"score": 1, "reasoning": "正确"} or {"score": 0, "reasoning": "错误"}'
  },
  {
    id: 'mmse_serial7_5',
    assessmentType: AssessmentType.MMSE,
    category: '注意力和计算力',
    text: '最后再减7是多少？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '65',
    grokPrompt: 'Check if answer is 65 OR continues correct subtraction pattern. Return ONLY: {"score": 1, "reasoning": "正确"} or {"score": 0, "reasoning": "错误"}'
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
    grokPrompt: 'Transcribe audio. Count recalled words from: 皮球, 国旗, 树木. Return ONLY: {"score": <0-3>, "reasoning": "回忆出X个：[列出]"}'
  },

  // 语言能力 - 命名 (2分)
  {
    id: 'mmse_naming_watch',
    assessmentType: AssessmentType.MMSE,
    category: '语言能力-命名',
    text: '看图命名：这是什么？',
    imageReference: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400',
    inputType: QuestionInputType.AUDIO,
    maxScore: 1,
    answerKey: '手表/表',
    grokPrompt: 'Transcribe audio. Check if says watch (accept: 手表, 表, watch). Return ONLY: {"score": 1, "reasoning": "正确"} or {"score": 0, "reasoning": "错误"}'
  },
  {
    id: 'mmse_naming_pen',
    assessmentType: AssessmentType.MMSE,
    category: '语言能力-命名',
    text: '看图命名：这是什么？',
    imageReference: 'https://images.unsplash.com/photo-1586158291800-2665f07bfa47?w=400',
    inputType: QuestionInputType.AUDIO,
    maxScore: 1,
    answerKey: '钢笔/笔',
    grokPrompt: 'Transcribe audio. Check if says pen (accept: 钢笔, 笔, pen, 圆珠笔). Return ONLY: {"score": 1, "reasoning": "正确"} or {"score": 0, "reasoning": "错误"}'
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
    grokPrompt: 'Transcribe audio. Check if exactly repeats: 四十四只石狮子 (must be exact). Return ONLY: {"score": 1, "reasoning": "准确"} or {"score": 0, "reasoning": "不准确"}'
  },

  // 语言能力 - 阅读 (1分)
  {
    id: 'mmse_read',
    assessmentType: AssessmentType.MMSE,
    category: '语言能力-阅读',
    text: '阅读并执行："闭上你的眼睛"',
    inputType: QuestionInputType.AUDIO,
    maxScore: 1,
    answerKey: '朗读并闭眼',
    grokPrompt: 'Transcribe audio. Check if user describes reading AND closing eyes. Return ONLY: {"score": 1, "reasoning": "已执行"} or {"score": 0, "reasoning": "未执行"}'
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
    grokPrompt: 'Transcribe audio. Count completed steps: (1) right hand (2) fold (3) left leg. Return ONLY: {"score": <0-3>, "reasoning": "完成X步：[列出]"}'
  },

  // 语言能力 - 书写 (1分)
  {
    id: 'mmse_write',
    assessmentType: AssessmentType.MMSE,
    category: '语言能力-书写',
    text: '写一个完整句子（拍照上传）',
    inputType: QuestionInputType.DRAWING,
    maxScore: 1,
    answerKey: '有主语和谓语',
    grokPrompt: 'Analyze image. Check if shows a complete sentence with subject and verb. Return ONLY: {"score": 1, "reasoning": "完整句子"} or {"score": 0, "reasoning": "不完整"}'
  },

  // 结构能力 (1分)
  {
    id: 'mmse_copy_pentagon',
    assessmentType: AssessmentType.MMSE,
    category: '结构能力',
    text: '临摹两个相交的五边形',
    imageReference: '/Pen.png',
    inputType: QuestionInputType.DRAWING,
    maxScore: 1,
    answerKey: '两个五边形相交成四边形',
    grokPrompt: 'Analyze image. Check: (1) Two pentagons (2) Each has 5 sides (3) They intersect (4) Overlap forms quadrilateral. Return ONLY: {"score": 1, "reasoning": "符合"} or {"score": 0, "reasoning": "不符合，因为..."}'
  }
];

export const MMSE_MAX_SCORE = 30;
export const MMSE_NORMAL_CUTOFF = 27;
