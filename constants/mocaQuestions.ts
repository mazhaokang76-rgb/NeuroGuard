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
    grokPrompt: `评分标准(1分):
- 正确连线: 必须从1开始，严格按照"数字→中文字母→数字"的交替顺序
- 连线不能中断或交叉错误
- 顺序: 1→甲→2→乙→3→丙→4→丁→5
- 如果有任何错误(顺序错、漏连、多连)，得0分
- 图片中必须能看到清晰的连线轨迹

分析图片，检查:
1. 是否从1开始
2. 是否交替连接数字和汉字
3. 顺序是否完全正确
4. 线条是否清晰可见

返回JSON: {"score": 0或1, "reasoning": "详细说明连线是否正确，指出具体错误(如有)"}`
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
    grokPrompt: `评分标准(1分):
- 必须是三维图形(有前后透视关系)
- 所有边都必须画出(12条边)
- 平行线必须平行
- 不能是平面正方形或长方形
- 不能有多余的线条
- 整体结构和比例大致正确

严格评分要点:
1. 是否有三维透视感(这是最关键的)
2. 边数是否正确(应该看到12条边)
3. 平行线是否保持平行
4. 不接受二维图形

返回JSON: {"score": 0或1, "reasoning": "说明立方体绘制质量，指出不符合要求之处"}`
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
    grokPrompt: `评分标准(总分3分):

【轮廓】(1分):
- 必须是封闭的圆形或近似圆形
- 不能有明显缺口
- 椭圆形可以接受

【数字】(1分):
- 必须有12个数字(1-12)
- 数字位置大致正确(12在上，6在下，3在右，9在左)
- 允许有轻微位置偏差
- 罗马数字可以接受
- 不接受: 数字缺失、顺序错误、全部写在一边

【指针】(1分):
- 必须有两根指针(时针和分针)
- 时针指向11(或11和12之间，因为是11:10)
- 分针指向2(代表10分钟)
- 两根指针长度应该不同
- 不接受: 指针指向错误、只有一根指针、指针位置完全错误

分析图片，分别评估三个要素:
1. 轮廓是否合格
2. 数字是否合格  
3. 指针是否合格(重点检查11:10是否正确)

返回JSON: {"score": 0到3, "reasoning": "分别说明轮廓(0/1)、数字(0/1)、指针(0/1)的得分理由"}`
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
    grokPrompt: `评分标准(1分):
正确答案: 狮子 / 狮 / Lion

接受的答案:
- "狮子"
- "狮"
- "Lion"
- "公狮"/"雄狮"

不接受:
- 含糊不清的发音
- "猫""老虎""动物"等不精确的答案
- 完全错误的动物名称

转录音频，检查是否准确说出"狮子"。
返回JSON: {"score": 0或1, "reasoning": "说明回答是否正确，如果错误指出说的是什么"}`
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
    grokPrompt: `这是学习阶段，不计分。
记录用户复述情况即可。
词语: 面孔、丝绒、寺庙、菊花、红色

返回JSON: {"score": 0, "reasoning": "学习阶段，已记录"}`
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
    grokPrompt: `评分标准(1分):
正确答案: 2-1-8-5-4 (完全按顺序)

必须完全正确:
- 5个数字全部正确
- 顺序完全正确
- 不能有遗漏或增加

一个数字错误 = 0分
顺序错误 = 0分

转录音频，检查数字序列。
返回JSON: {"score": 0或1, "reasoning": "说明复述的数字序列，是否完全正确"}`
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
    grokPrompt: `评分标准(1分):
原始顺序: 7-4-2
正确答案(倒序): 2-4-7

必须完全正确:
- 倒序后3个数字全对
- 顺序正确
- 不能有遗漏

任何错误 = 0分

转录音频，检查是否说出2-4-7。
返回JSON: {"score": 0或1, "reasoning": "说明倒背结果，是否为2-4-7"}`
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
    grokPrompt: `评分标准(1分):
序列中数字"1"出现10次
正确次数: 10次

得分标准:
- 错误≤2次(说8-10次"敲"): 得1分
- 错误>2次(说<8次或>12次): 得0分

允许的误差范围: 8-12次都可接受

转录音频，数一下说了几次"敲/tap/knock"。
返回JSON: {"score": 0或1, "reasoning": "说了X次，应该10次，误差是否在允许范围内"}`
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
    grokPrompt: `评分标准(3分):
正确答案: 93, 86, 79, 72, 65

计分规则:
- 4-5个正确: 3分
- 2-3个正确: 2分  
- 1个正确: 1分
- 0个正确: 0分

注意: 如果前面错了但后续按照错误结果继续正确减7，后续的算对
例如: 说92, 85, 78, 71, 64 → 虽然第一个错了，但后续逻辑正确，算4个对

转录音频，识别5个数字，计算正确个数。
返回JSON: {"score": 0到3, "reasoning": "列出5个答案，说明各自对错，给出总分"}`
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
    grokPrompt: `评分标准(1分):
≥11个不同的词: 1分
<11个词: 0分

要求:
- 必须是"yi"音开头(任何声调)
- 不计重复的词
- 不计错误发音或非中文词
- 只计算清晰可辨的词

示例词: 医生、衣服、椅子、意思、一切、移动、疑问、仪器、艺术、音乐、银行...

转录音频，数清晰的"yi"音开头词汇数量。
返回JSON: {"score": 0或1, "reasoning": "共说出X个有效词汇(列出来)，是否≥11个"}`
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
    grokPrompt: `评分标准(5分):
5个词: 面孔、丝绒、寺庙、菊花、红色
每正确回忆1个词得1分

要求:
- 必须是自主回忆(不能提示)
- 词语必须准确
- 顺序不重要
- 近似词不算(如"脸"不等于"面孔")

计分:
- 说出全部5个: 5分
- 说出4个: 4分
- 依此类推

转录音频，检查说出了哪几个词。
返回JSON: {"score": 0到5, "reasoning": "回忆出: [列出词语]，共X个，得X分"}`
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
