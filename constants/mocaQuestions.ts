import { AssessmentType, Question, QuestionInputType } from '../types';

export const MOCA_QUESTIONS: Question[] = [
  // 视空间/执行能力 - 连线测试 (1分)
  {
    id: 'moca_trail',
    assessmentType: AssessmentType.MOCA,
    category: '视空间/执行能力',
    text: '交替连线测试',
    subText: '请按照 1→甲→2→乙→3→丙→4→丁→5 的顺序用笔连线',
    imageReference: 'https://i.imgur.com/9xKZY3M.png',
    inputType: QuestionInputType.DRAWING,
    maxScore: 1,
    answerKey: '从1开始，交替连接数字和中文字母：1-甲-2-乙-3-丙-4-丁-5',
    grokPrompt: 'Analyze image. Check: (1) Lines connect 1→甲→2→乙→3→丙→4→丁→5 in order (2) No crossing errors. Return ONLY: {"score": 1, "reasoning": "正确"} or {"score": 0, "reasoning": "错误，因为..."}'
  },

  // 视空间/执行能力 - 立方体 (1分)
  {
    id: 'moca_cube',
    assessmentType: AssessmentType.MOCA,
    category: '视空间/执行能力',
    text: '复制立方体',
    subText: '请照着图片画出这个三维立方体',
    imageReference: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Necker_cube.svg/240px-Necker_cube.svg.png',
    inputType: QuestionInputType.DRAWING,
    maxScore: 1,
    answerKey: '必须画出三维立方体，有透视关系，所有线条和角度基本正确',
    grokPrompt: 'Analyze image. Check: (1) 3D cube with perspective (2) 12 edges visible (3) Parallel lines remain parallel. Return ONLY: {"score": 1, "reasoning": "正确3D立方体"} or {"score": 0, "reasoning": "不符合，因为..."}'
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
    grokPrompt: 'Analyze clock. Score 3 parts: (1) Circle contour=1pt (2) Numbers 1-12 positioned correctly=1pt (3) Hands at 11:10 (hour near 11, minute at 2)=1pt. Return ONLY: {"score": <0-3>, "reasoning": "轮廓X分+数字X分+指针X分"}'
  },

  // 命名 (3分)
  {
    id: 'moca_naming_lion',
    assessmentType: AssessmentType.MOCA,
    category: '命名',
    text: '看图命名',
    subText: '请说出图片中的动物名称',
    imageReference: 'https://images.pexels.com/photos/247502/pexels-photo-247502.jpeg?w=400',
    inputType: QuestionInputType.AUDIO,
    maxScore: 1,
    answerKey: '狮子',
    grokPrompt: 'Transcribe audio. Check if says lion/狮子. Return ONLY: {"score": 1, "reasoning": "正确"} or {"score": 0, "reasoning": "错误，说的是..."}'
  },

  {
    id: 'moca_naming_rhino',
    assessmentType: AssessmentType.MOCA,
    category: '命名',
    text: '看图命名',
    subText: '请说出图片中的动物名称',
    imageReference: 'https://images.pexels.com/photos/63287/pexels-photo-63287.jpeg?w=400',
    inputType: QuestionInputType.AUDIO,
    maxScore: 1,
    answerKey: '犀牛',
    grokPrompt: `评分标准(1分):
正确答案: 犀牛 / Rhinoceros / Rhino

接受的答案:
- "犀牛"
- "Rhino"
- "Rhinoceros"

不接受:
- "牛""水牛""野牛"(不够精确)
- 含糊不清无法辨认
- 完全错误的动物

转录音频，检查是否准确说出"犀牛"。
返回JSON: {"score": 0或1, "reasoning": "说明回答内容和准确性"}`
  },

  {
    id: 'moca_naming_camel',
    assessmentType: AssessmentType.MOCA,
    category: '命名',
    text: '看图命名',
    subText: '请说出图片中的动物名称',
    imageReference: 'https://images.pexels.com/photos/2361952/pexels-photo-2361952.jpeg?w=400',
    inputType: QuestionInputType.AUDIO,
    maxScore: 1,
    answerKey: '骆驼',
    grokPrompt: `评分标准(1分):
正确答案: 骆驼 / Camel

接受的答案:
- "骆驼"
- "Camel"
- "单峰驼""双峰驼"(更精确的答案)

不接受:
- "马""驴""羊驼"
- 含糊不清
- 其他错误动物

转录音频，检查是否说"骆驼"。
返回JSON: {"score": 0或1, "reasoning": "说明命名是否准确"}`
  },

  // 记忆 - 即时学习 (不计分)
  {
    id: 'moca_memory_learn',
    assessmentType: AssessmentType.MOCA,
    category: '记忆',
    text: '词语记忆学习',
    subText: '我会说5个词，请仔细听并重复。这些词稍后会再问你。',
    inputType: QuestionInputType.TEXT,
    maxScore: 0,
    answerKey: '面孔、丝绒、寺庙、菊花、红色（学习阶段不计分）',
    grokPrompt: 'This is learning phase, no scoring needed. Return: {"score": 0, "reasoning": "学习阶段已记录"}'
  },

  // 注意力 - 顺背数字 (1分)
  {
    id: 'moca_attention_forward',
    assessmentType: AssessmentType.MOCA,
    category: '注意力',
    text: '顺背数字',
    subText: '我说一串数字，请你按照同样的顺序重复: 2 1 8 5 4',
    inputType: QuestionInputType.AUDIO,
    maxScore: 1,
    answerKey: '2 1 8 5 4',
    grokPrompt: 'Transcribe audio. Check if repeats: 2-1-8-5-4 (exact order). Return ONLY: {"score": 1, "reasoning": "正确"} or {"score": 0, "reasoning": "错误，说的是..."}'
  },

  // 注意力 - 倒背数字 (1分)
  {
    id: 'moca_attention_backward',
    assessmentType: AssessmentType.MOCA,
    category: '注意力',
    text: '倒背数字',
    subText: '我说一串数字，请你倒着说回来: 7 4 2',
    inputType: QuestionInputType.AUDIO,
    maxScore: 1,
    answerKey: '2 4 7',
    grokPrompt: 'Transcribe audio. Check if says: 2-4-7 (reversed from 7-4-2). Return ONLY: {"score": 1, "reasoning": "正确"} or {"score": 0, "reasoning": "错误，说的是..."}'
  },

  // 注意力 - 警觉性 (1分)
  {
    id: 'moca_attention_tap',
    assessmentType: AssessmentType.MOCA,
    category: '注意力',
    text: '警觉性测试',
    subText: '我会读一串数字，每当你听到"1"时，请说"敲"或敲击桌子。数字序列: 5 2 1 3 9 4 1 1 8 0 6 2 1 5 1 9 4 5 1 1 1 4 1 9 0 5 1 1 2',
    inputType: QuestionInputType.AUDIO,
    maxScore: 1,
    answerKey: '数字1共出现10次，应该说10次"敲"',
    grokPrompt: 'Transcribe audio. Count how many times user says "敲/knock/tap". Should be 10 times (digit "1" appears 10 times). Score 1 if 8-12 times (±2 errors ok), else 0. Return ONLY: {"score": <0 or 1>, "reasoning": "说了X次"}'
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
    grokPrompt: 'Transcribe audio. Extract 5 numbers from speech. Count how many match: 93, 86, 79, 72, 65. Score: 4-5 correct=3pts, 2-3 correct=2pts, 1 correct=1pt, 0 correct=0pts. If first wrong but subsequent pattern correct, count those as correct. Return ONLY: {"score": <0-3>, "reasoning": "说出的5个数字是[...],正确X个"}'
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
    grokPrompt: `评分标准(1分):
必须完全准确，一字不差。

正确: "我只知道今天小张来帮忙"

不接受:
- 任何字词的改变、增加或遗漏
- "我就知道今天小张来帮忙"(错)
- "我只知道今天张某来帮忙"(错)
- 语序错误

转录音频，逐字对比。
返回JSON: {"score": 0或1, "reasoning": "复述内容，是否完全准确"}`
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
    grokPrompt: `评分标准(1分):
必须完全准确。

正确: "狗在房间时，猫总躲在沙发下面"

不接受任何改动:
- 字词错误
- 语序错误  
- 增加或遗漏

转录后逐字对比原句。
返回JSON: {"score": 0或1, "reasoning": "复述是否一字不差"}`
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
    grokPrompt: 'Transcribe audio. Count unique Chinese words starting with "yi" sound (医生,衣服,椅子,意思,etc). Score 1 if ≥11 words, else 0. Return ONLY: {"score": <0 or 1>, "reasoning": "说出X个词：[列举]"}'
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
    grokPrompt: `评分标准(1分):
必须说出抽象类别概念。

接受的答案:
- "交通工具"
- "运输工具"
- "代步工具"
- "Transportation"

不接受:
- "都有轮子"(具体特征，不是抽象类别)
- "都能动"(太宽泛)
- "都是东西"(无意义)
- 具体功能描述而非类别

关键: 必须是上位概念/类别。

返回JSON: {"score": 0或1, "reasoning": "回答的类别是否正确抽象"}`
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
    grokPrompt: `评分标准(1分):
必须说出抽象类别。

接受的答案:
- "测量工具"
- "度量工具"
- "测量仪器"
- "Measuring tools/instruments"

不接受:
- "都有刻度"(具体特征)
- "都是工具"(太宽泛，手表主要不是工具)
- "都能看时间/长度"(功能描述，不是类别)

关键: 测量/度量这个概念。

返回JSON: {"score": 0或1, "reasoning": "是否正确识别测量工具这一类别"}`
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
    grokPrompt: 'Transcribe audio. Count recalled words from: 面孔, 丝绒, 寺庙, 菊花, 红色. Each correct word = 1 point. Return ONLY: {"score": <0-5>, "reasoning": "回忆出X个：[列出词语]"}'
  },

  // 定向力 (6分)
  {
    id: 'moca_orientation_date',
    assessmentType: AssessmentType.MOCA,
    category: '定向力',
    text: '今天是几号？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '当天日期',
    grokPrompt: `评分标准(1分):
正确说出当天日期。
±1天误差可接受。

今天参考日期: 2025年12月10日左右

接受: 10号、10日、December 10
不接受: 差距>1天

返回JSON: {"score": 0或1, "reasoning": "回答X号，是否正确"}`
  },

  {
    id: 'moca_orientation_month',
    assessmentType: AssessmentType.MOCA,
    category: '定向力',
    text: '现在是几月份？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '12月 / December',
    grokPrompt: `评分标准(1分):
正确答案: 12月 / December / 十二月

必须准确，不接受其他月份。

返回JSON: {"score": 0或1, "reasoning": "是否正确回答12月"}`
  },

  {
    id: 'moca_orientation_year',
    assessmentType: AssessmentType.MOCA,
    category: '定向力',
    text: '今年是哪一年？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '2025',
    grokPrompt: `评分标准(1分):
正确答案: 2025

必须准确。

返回JSON: {"score": 0或1, "reasoning": "是否正确说出2025"}`
  },

  {
    id: 'moca_orientation_day',
    assessmentType: AssessmentType.MOCA,
    category: '定向力',
    text: '今天是星期几？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '当天星期',
    grokPrompt: `评分标准(1分):
必须说对今天是星期几。
2025年12月10日是星期三。

接受: 星期三、周三、Wednesday

返回JSON: {"score": 0或1, "reasoning": "回答是否正确"}`
  },

  {
    id: 'moca_orientation_place',
    assessmentType: AssessmentType.MOCA,
    category: '定向力',
    text: '我们现在在什么地方？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '合理的地点描述',
    grokPrompt: `评分标准(1分):
说出合理的地点即可。

接受:
- 医院/诊所名称
- 家里/家中
- 具体地点名称

不接受:
- 完全错误或荒谬
- "不知道"

返回JSON: {"score": 0或1, "reasoning": "地点描述是否合理"}`
  },

  {
    id: 'moca_orientation_city',
    assessmentType: AssessmentType.MOCA,
    category: '定向力',
    text: '我们现在在哪个城市？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '实际所在城市',
    grokPrompt: `评分标准(1分):
说出合理的城市名称。

可以接受用户实际所在地的任何城市。

不接受: 明显错误或不是城市

返回JSON: {"score": 0或1, "reasoning": "城市名称是否合理"}`
  }
];

export const MOCA_MAX_SCORE = 30;
