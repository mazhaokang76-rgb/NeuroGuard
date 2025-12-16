// constants/mocaQuestions.ts
import { AssessmentType, Question, QuestionInputType } from '../types';

// 辅助函数：根据月份判断季节（北半球）
const getCurrentSeason = (): string => {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return '春季/春天/spring';
  if (month >= 6 && month <= 8) return '夏季/夏天/summer';
  if (month >= 9 && month <= 11) return '秋季/秋天/autumn/fall';
  return '冬季/冬天/winter';
};

// 生成当前日期时间信息
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
    monthNameCN: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'][now.getMonth()],
    season: getCurrentSeason()
  };
};

export const MOCA_QUESTIONS: Question[] = [
  // 视空间/执行能力 - 连线测试 (1分)
  {
    id: 'moca_trail',
    assessmentType: AssessmentType.MOCA,
    category: '视空间/执行能力',
    text: '交替连线测试',
    subText: '请按照 1→甲→2→乙→3→丙→4→丁→5 的顺序用笔连线',
    imageReference: '/pics/trail_making.png',
    inputType: QuestionInputType.DRAWING,
    maxScore: 1,
    answerKey: '从1开始，交替连接数字和中文字母：1-甲-2-乙-3-丙-4-丁-5',
    grokPrompt: 'Analyze the drawing. Check if lines correctly connect in this EXACT sequence: 1→甲→2→乙→3→丙→4→丁→5. Requirements: (1) Correct alternating pattern (number-Chinese letter), (2) Correct order, (3) Lines connect endpoints (no skipping). Minor line quality issues OK. Return ONLY: {"score": 1, "reasoning": "顺序正确"} or {"score": 0, "reasoning": "错误，因为..."}'
  },

  // 视空间/执行能力 - 立方体 (1分)
  {
    id: 'moca_cube',
    assessmentType: AssessmentType.MOCA,
    category: '视空间/执行能力',
    text: '复制立方体',
    subText: '请照着图片画出这个三维立方体',
    imageReference: '/pics/cube.png',
    inputType: QuestionInputType.DRAWING,
    maxScore: 1,
    answerKey: '三维立方体，透视关系正确，线条基本正确',
    grokPrompt: 'Analyze the cube drawing. Requirements for 1 point: (1) 3D cube structure visible (not just 2D square), (2) Approximately 12 edges drawn, (3) Basic perspective maintained (parallel lines stay roughly parallel, depth shown). Minor drawing quality issues OK. Proportions do not need to be perfect. Return ONLY: {"score": 1, "reasoning": "正确3D立方体"} or {"score": 0, "reasoning": "不符合，因为..."}'
  },

  // 视空间/执行能力 - 画钟 (3分)
  {
    id: 'moca_clock',
    assessmentType: AssessmentType.MOCA,
    category: '视空间/执行能力',
    text: '画钟测试',
    subText: '请画一个圆形钟表，标上数字1-12，并画出指针指向11点10分',
    inputType: QuestionInputType.DRAWING,
    maxScore: 3,
    answerKey: '轮廓(1分) + 数字(1分) + 指针(1分) = 3分',
    grokPrompt: 'Analyze clock drawing. Score 3 parts separately: (1) CONTOUR: Circle drawn (roughly round, closed figure) = 1pt, (2) NUMBERS: All 12 numbers (1-12) present and roughly in correct positions around clock face = 1pt, (3) HANDS: Two hands pointing to 11:10 (hour hand between 11-12, minute hand at 2) = 1pt. Score each part independently. Return ONLY: {"score": <0-3>, "reasoning": "轮廓X分+数字X分+指针X分，具体说明..."}'
  },

  // 命名 (3分)
  {
    id: 'moca_naming_lion',
    assessmentType: AssessmentType.MOCA,
    category: '命名',
    text: '看图命名',
    subText: '请说出图片中的动物名称',
    imageReference: '/pics/lion.jpg',
    inputType: QuestionInputType.AUDIO,
    maxScore: 1,
    answerKey: '狮子',
    grokPrompt: 'Transcribe audio carefully. Check if correctly identifies as LION (accept: 狮子, lion, male lion, 雄狮). Do NOT accept: 老虎 (tiger), 猫科 (feline family - too general), 大猫 (big cat). Return ONLY: {"score": 1, "reasoning": "正确识别为狮子"} or {"score": 0, "reasoning": "错误，说的是..."}'
  },

  {
    id: 'moca_naming_rhino',
    assessmentType: AssessmentType.MOCA,
    category: '命名',
    text: '看图命名',
    subText: '请说出图片中的动物名称',
    imageReference: '/pics/rhino.jpg',
    inputType: QuestionInputType.AUDIO,
    maxScore: 1,
    answerKey: '犀牛',
    grokPrompt: `Transcribe audio. Scoring (1 point):

CORRECT answers:
- "犀牛"
- "Rhinoceros"
- "Rhino"  
- "犀" (acceptable - specific enough)

NOT ACCEPTED:
- "牛" (too general - not specific enough)
- "水牛" "野牛" (wrong species)
- Unclear/inaudible
- Completely wrong animal

Return ONLY: {"score": 0 or 1, "reasoning": "说了...，是否正确"}`
  },

  {
    id: 'moca_naming_camel',
    assessmentType: AssessmentType.MOCA,
    category: '命名',
    text: '看图命名',
    subText: '请说出图片中的动物名称',
    imageReference: '/pics/camel.jpg',
    inputType: QuestionInputType.AUDIO,
    maxScore: 1,
    answerKey: '骆驼',
    grokPrompt: `Transcribe audio. Scoring (1 point):

CORRECT answers:
- "骆驼"
- "Camel"
- "单峰驼" "双峰驼" (more specific - correct)
- "驼" (acceptable if clear)

NOT ACCEPTED:
- "马" "驴" "羊" "羊驼" (wrong animals)
- Unclear/inaudible
- Generic non-answer

Return ONLY: {"score": 0 or 1, "reasoning": "命名是否准确"}`
  },

  // 记忆 - 即时学习 (不计分)
  {
    id: 'moca_memory_learn',
    assessmentType: AssessmentType.MOCA,
    category: '记忆',
    text: '词语记忆学习',
    subText: '我会说5个词，请仔细听并重复：面孔、丝绒、寺庙、菊花、红色',
    audioSrc: '/voice/voicepiece.mp3', // 新增
    inputType: QuestionInputType.AUDIO,
    maxScore: 0,
    grokPrompt: 'This is the learning phase only. No scoring. Just acknowledge. Return: {"score": 0, "reasoning": "学习阶段已记录，稍后测试延迟回忆"}'
  },

  // 注意力 - 顺背数字 (1分)
  {
    id: 'moca_attention_forward',
    assessmentType: AssessmentType.MOCA,
    category: '注意力',
    text: '请按顺序重复这些数字：2、1、5、4、3',
    audioSrc: '/voice/remember1.mp3', // 新增
    inputType: QuestionInputType.AUDIO,
    maxScore: 1,
    grokPrompt: 'Transcribe audio carefully. Extract the numbers spoken. Check if they match EXACTLY: 2-1-8-5-4 in that order. Accept: verbal (二一八五四) or digit pronunciation. Must be exact sequence with all 5 digits. Return ONLY: {"score": 1, "reasoning": "正确顺序"} or {"score": 0, "reasoning": "错误，说的是..."}'
  },

  // 注意力 - 倒背数字 (1分)
  {
    id: 'moca_attention_backward',
    assessmentType: AssessmentType.MOCA,
    category: '注意力',
    text: '请倒着重复这些数字：5、4、2',
    audioSrc: '/voice/remember2.mp3', // 新增
    inputType: QuestionInputType.AUDIO,
    maxScore: 1,
    grokPrompt: 'Transcribe audio. Extract the numbers. Original sequence is 7-4-2, so REVERSED should be: 2-4-7. Check if user says exactly 2-4-7. Accept verbal or digit pronunciation. Return ONLY: {"score": 1, "reasoning": "正确倒背"} or {"score": 0, "reasoning": "错误，说的是..."}'
  },

  // 注意力 - 警觉性 (1分)
  {
    id: 'moca_attention_tap',
    assessmentType: AssessmentType.MOCA,
    category: '注意力',
    text: '警觉性测试',
    subText: '我会读一串数字，每当你听到"1"时，请说"敲"或敲击桌子。数字序列: 5 2 1 3 9 4 1 1 8 0 6 2 1 5 1 9 4 5 1 1 1 4 1 9 0 5 1 1 2',
    audioSrc: '/voice/knock.mp3', // 新增
    inputType: QuestionInputType.AUDIO,
    grokPrompt: 'Transcribe audio. Count how many times user says "敲" or "knock" or "tap" or describes tapping. Sequence has 10 occurrences of digit "1". Scoring: ≥8 correct responses (±2 errors allowed) = 1 point, <8 = 0 points. Return ONLY: {"score": 0 or 1, "reasoning": "说了X次敲，目标10次"}'
  },

  // 注意力 - 连续减7 (3分)
  {
    id: 'moca_attention_serial7',
    assessmentType: AssessmentType.MOCA,
    category: '注意力',
    text: '连续减7',
    subText: '从100开始，每次减7，连续说出5个答案',
    inputType: QuestionInputType.AUDIO,
    maxScore: 3,
    answerKey: '93, 86, 79, 72, 65',
    grokPrompt: 'Transcribe audio. Extract 5 numbers. Correct sequence: 93, 86, 79, 72, 65. Count how many match. SCORING: 4-5 correct = 3 points, 2-3 correct = 2 points, 1 correct = 1 point, 0 correct = 0 points. If first answer wrong but subsequent subtractions correct (serial subtraction), count those as correct. Return ONLY: {"score": <0-3>, "reasoning": "说了[...], 正确X个"}'
  },

  // 语言 - 复述句子 (2分)
  {
    id: 'moca_repeat_1',
    assessmentType: AssessmentType.MOCA,
    category: '语言',
    text: '复述句子(1)',
    subText: '请准确重复这句话: "我只知道今天小张来帮忙"',
    inputType: QuestionInputType.AUDIO,
    maxScore: 1,
    answerKey: '我只知道今天小张来帮忙',
    grokPrompt: `Transcribe audio word by word. Scoring (1 point):

Must be EXACTLY: "我只知道今天小张来帮忙"

NOT ACCEPTED (any deviation = 0 points):
- "我就知道今天小张来帮忙" (就 ≠ 只)
- "我只知道今天张某来帮忙" (张某 ≠ 小张)
- "我只知道小张今天来帮忙" (word order wrong)
- Any word added, removed, or changed

Must be word-perfect. Return ONLY: {"score": 0 or 1, "reasoning": "复述:[实际说的]，是否完全准确"}`
  },

  {
    id: 'moca_repeat_2',
    assessmentType: AssessmentType.MOCA,
    category: '语言',
    text: '复述句子(2)',
    subText: '请准确重复这句话: "狗在房间时，猫总躲在沙发下面"',
    inputType: QuestionInputType.AUDIO,
    maxScore: 1,
    answerKey: '狗在房间时，猫总躲在沙发下面',
    grokPrompt: `Transcribe audio precisely. Scoring (1 point):

Must be EXACTLY: "狗在房间时，猫总躲在沙发下面"

NOT ACCEPTED:
- Any word substitution
- Any word order change
- Any word added or omitted
- "狗在房间里时..." (里 added - wrong)

Must be word-perfect. Return ONLY: {"score": 0 or 1, "reasoning": "复述:[实际]，是否一字不差"}`
  },

  // 语言 - 流畅性 (1分)
  {
    id: 'moca_fluency',
    assessmentType: AssessmentType.MOCA,
    category: '语言',
    text: '语言流畅性',
    subText: '请在1分钟内说出尽可能多以"yi"音开头的词语(如: 医生、衣服、椅子、意思...)',
    inputType: QuestionInputType.AUDIO,
    maxScore: 1,
    answerKey: '需要说出11个或以上不重复的词',
    grokPrompt: 'Transcribe audio. Count UNIQUE Chinese words starting with "yi" sound (一/医/衣/椅/意/议/艺/易/益/异/忆/义/仪/宜/etc). Examples: 医生,衣服,椅子,意思,一样,艺术,容易,议论,etc. Do NOT count: repetitions, non-yi-starting words, numbers only (一二三). SCORING: ≥11 unique words = 1 point, <11 = 0 points. Return ONLY: {"score": 0 or 1, "reasoning": "说出X个词:[列举]"}'
  },

  // 抽象 (2分)
  {
    id: 'moca_abstraction_1',
    assessmentType: AssessmentType.MOCA,
    category: '抽象',
    text: '抽象思维(1)',
    subText: '火车和自行车有什么相同之处？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '交通工具 / 运输工具',
    grokPrompt: `Scoring (1 point): Must identify ABSTRACT CATEGORY, not concrete features.

CORRECT (abstract category):
- "交通工具" (transportation)
- "运输工具" (transport)
- "代步工具" (means of transport)
- "车辆" (vehicles)
- "Transportation" / "Vehicle"

NOT ACCEPTED (concrete features, not abstract):
- "都有轮子" (both have wheels - concrete feature)
- "都能动" (both move - too vague)
- "都是东西" (both are things - meaningless)
- Functional descriptions instead of category

Key: Must be superordinate concept/category. Return ONLY: {"score": 0 or 1, "reasoning": "回答类别是否抽象正确"}`
  },

  {
    id: 'moca_abstraction_2',
    assessmentType: AssessmentType.MOCA,
    category: '抽象',
    text: '抽象思维(2)',
    subText: '手表和直尺有什么相同之处？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '测量工具 / 度量工具',
    grokPrompt: `Scoring (1 point): Must identify ABSTRACT CATEGORY.

CORRECT:
- "测量工具" (measuring tools)
- "度量工具" (instruments for measurement)
- "测量仪器" (measuring instruments)
- "Measuring tools/instruments"

NOT ACCEPTED:
- "都有刻度" (both have scales - concrete feature)
- "都是工具" (both are tools - too vague, watch is not primarily a tool)
- "都能看时间/长度" (functional description, not category)

Key: Must recognize measurement/calibration concept. Return ONLY: {"score": 0 or 1, "reasoning": "是否识别测量工具类别"}`
  },

  // 延迟回忆 (5分)
  {
    id: 'moca_memory_recall',
    assessmentType: AssessmentType.MOCA,
    category: '延迟回忆',
    text: '词语回忆',
    subText: '请回忆之前让你记住的5个词',
    inputType: QuestionInputType.AUDIO,
    maxScore: 5,
    answerKey: '面孔、丝绒、寺庙、菊花、红色',
    grokPrompt: 'Transcribe audio. Count how many of these words or same pronunciation in chinese are spontaneously recalled: 面孔 (face), 丝绒 (velvet), 寺庙 (church/temple), 菊花 (daisy/chrysanthemum), 红色 (red). Each correctly recalled word = 1 point. Must be unprompted recall. Accept slight pronunciation variations but NOT synonyms (e.g., 脸 ≠ 面孔, 庙 alone ≠ 寺庙). Return ONLY: {"score": <0-5>, "reasoning": "回忆出X个:[列出词]"}'  },

  // 定向力 (6分)
  {
    id: 'moca_orientation_date',
    assessmentType: AssessmentType.MOCA,
    category: '定向力',
    text: '今天是几号？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: `${getCurrentDateInfo().date}号`,
    grokPrompt: `Scoring (1 point):
Current date: ${getCurrentDateInfo().year}年${getCurrentDateInfo().month}月${getCurrentDateInfo().date}日
Today is ${getCurrentDateInfo().date}号.

ACCEPT: ±1 day error tolerated
- ${getCurrentDateInfo().date-1}号, ${getCurrentDateInfo().date}号, ${getCurrentDateInfo().date+1}号
- With or without 号/日

NOT ACCEPT: >1 day difference

Return ONLY: {"score": 0 or 1, "reasoning": "回答X号，今天是${getCurrentDateInfo().date}号"}`
  },

  {
    id: 'moca_orientation_month',
    assessmentType: AssessmentType.MOCA,
    category: '定向力',
    text: '现在是几月份？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: `${getCurrentDateInfo().month}月`,
    grokPrompt: `Scoring (1 point):
Current month: ${getCurrentDateInfo().month}月 (${getCurrentDateInfo().monthName} / ${getCurrentDateInfo().monthNameCN})

ACCEPT:
- ${getCurrentDateInfo().month}, ${getCurrentDateInfo().month}月
- ${getCurrentDateInfo().monthNameCN}
- ${getCurrentDateInfo().monthName}

Must be exact month. No tolerance.

Return ONLY: {"score": 0 or 1, "reasoning": "回答是否正确，现在是${getCurrentDateInfo().month}月"}`
  },

  {
    id: 'moca_orientation_year',
    assessmentType: AssessmentType.MOCA,
    category: '定向力',
    text: '今年是哪一年？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: `${getCurrentDateInfo().year}年`,
    grokPrompt: `Scoring (1 point):
Current year: ${getCurrentDateInfo().year}

ACCEPT:
- ${getCurrentDateInfo().year}
- ${getCurrentDateInfo().year}年
- Chinese number format

Must be exact year.

Return ONLY: {"score": 0 or 1, "reasoning": "是否正确，今年${getCurrentDateInfo().year}年"}`
  },

  {
    id: 'moca_orientation_day',
    assessmentType: AssessmentType.MOCA,
    category: '定向力',
    text: '今天是星期几？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: getCurrentDateInfo().dayName,
    grokPrompt: `Scoring (1 point):
Today: ${new Date().toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}
Day of week: ${getCurrentDateInfo().dayName} (${getCurrentDateInfo().dayNameShort})

ACCEPT:
- ${getCurrentDateInfo().dayName}
- ${getCurrentDateInfo().dayNameShort}
- ${new Date().toLocaleDateString('en-US', {weekday: 'long'})}
- 礼拜${getCurrentDateInfo().day === 0 ? '日' : getCurrentDateInfo().day}

Must match current day exactly.

Return ONLY: {"score": 0 or 1, "reasoning": "今天${getCurrentDateInfo().dayName}"}`
  },

  {
    id: 'moca_orientation_place',
    assessmentType: AssessmentType.MOCA,
    category: '定向力',
    text: '我们现在在什么地方？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '医院/家里/诊所等合理地点',
    grokPrompt: `Scoring (1 point):
Must provide reasonable current location.

ACCEPT:
- Hospital name (XX医院)
- "家里" / "家中" (home)
- Clinic (诊所/卫生院)
- Doctor's office (医务室)
- Rehabilitation center (康复中心)
- Specific place name
- General descriptions like "在家", "医院"

NOT ACCEPT:
- Completely absurd ("月球", "海底")
- "不知道" without attempt

If user location context is provided, consider if consistent.

Return ONLY: {"score": 0 or 1, "reasoning": "地点描述合理性"}`
  },

  {
    id: 'moca_orientation_city',
    assessmentType: AssessmentType.MOCA,
    category: '定向力',
    text: '我们现在在哪个城市？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '根据设备位置判断',
    grokPrompt: `Scoring (1 point):
Must provide reasonable city name.

If user location is provided in context (【用户位置信息】城市: XX), check if answer matches or is close.

ACCEPT:
- Exact match or reasonable variation (南京 vs 南京市)
- If no location context: any valid Chinese city name

NOT ACCEPT:
- Obviously not a city (village names, landmarks)
- Nonsensical answers

Return ONLY: {"score": 0 or 1, "reasoning": "城市名称合理性，如有位置信息则说明是否匹配"}`
  }
];

export const MOCA_MAX_SCORE = 30;
