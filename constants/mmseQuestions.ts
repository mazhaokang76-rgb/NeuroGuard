import { AssessmentType, Question, QuestionInputType } from '../types';

export const MMSE_QUESTIONS: Question[] = [
  // I. 定向力 - 时间 (5分)
  {
    id: 'mmse_time_year',
    assessmentType: AssessmentType.MMSE,
    category: '定向力-时间',
    text: '今年是哪一年？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '2025年',
    grokPrompt: `评分标准(1分):
正确答案: 2025年

操作说明: 首先询问日期，再针对性询问其他部分。每答对一题得1分。

返回JSON: {"score": 0或1, "reasoning": "说明答案是否正确"}`
  },
  {
    id: 'mmse_time_season',
    assessmentType: AssessmentType.MMSE,
    category: '定向力-时间',
    text: '现在是什么季节？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '冬季 / 冬天',
    grokPrompt: `评分标准(1分):
正确答案: 冬季/冬天 (December)

每答对一题得1分。

返回JSON: {"score": 0或1, "reasoning": "季节是否正确"}`
  },
  {
    id: 'mmse_time_month',
    assessmentType: AssessmentType.MMSE,
    category: '定向力-时间',
    text: '现在是几月份？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '12月 / 十二月',
    grokPrompt: `评分标准(1分):
正确答案: 12月/十二月

注意: 月、日可以记阴历。
日期和星期差一天可计正常。

返回JSON: {"score": 0或1, "reasoning": "月份是否正确"}`
  },
  {
    id: 'mmse_time_date',
    assessmentType: AssessmentType.MMSE,
    category: '定向力-时间',
    text: '今天是几号？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '当天日期（允许±1天误差）',
    grokPrompt: `评分标准(1分):
参考日期: 2025年12月10日左右

日期和星期差一天可计正常。
月、日可以记阴历。

±1天误差可接受。

返回JSON: {"score": 0或1, "reasoning": "日期是否在允许范围内"}`
  },
  {
    id: 'mmse_time_day',
    assessmentType: AssessmentType.MMSE,
    category: '定向力-时间',
    text: '今天是星期几？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '星期三 / 周三',
    grokPrompt: `评分标准(1分):
2025年12月10日是星期三。

日期和星期差一天可计正常。

返回JSON: {"score": 0或1, "reasoning": "星期是否正确（允许±1天）"}`
  },

  // I. 定向力 - 地点 (5分)
  {
    id: 'mmse_place_province',
    assessmentType: AssessmentType.MMSE,
    category: '定向力-地点',
    text: '您能告诉我你住在什么省吗？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '任何合理的省份名称',
    grokPrompt: `评分标准(1分):
操作说明: 请依次提问，每答对一题得一分。

接受任何合理的中国省份名称。

返回JSON: {"score": 0或1, "reasoning": "是否说出合理省份"}`
  },
  {
    id: 'mmse_place_city',
    assessmentType: AssessmentType.MMSE,
    category: '定向力-地点',
    text: '您住在什么市（区县）？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '任何合理的城市/区县名称',
    grokPrompt: `评分标准(1分):
每答对一题得1分。

返回JSON: {"score": 0或1, "reasoning": "城市/区县名称是否合理"}`
  },
  {
    id: 'mmse_place_street',
    assessmentType: AssessmentType.MMSE,
    category: '定向力-地点',
    text: '您住在什么街道？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '任何合理的街道名称',
    grokPrompt: `评分标准(1分):
每答对一题得1分。

返回JSON: {"score": 0或1, "reasoning": "街道名称是否合理"}`
  },
  {
    id: 'mmse_place_location',
    assessmentType: AssessmentType.MMSE,
    category: '定向力-地点',
    text: '咱们现在在什么地方？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '医院/家里/诊所等合理地点',
    grokPrompt: `评分标准(1分):
接受: 医院、诊所、家里、具体地点名称等。

返回JSON: {"score": 0或1, "reasoning": "地点描述是否合理"}`
  },
  {
    id: 'mmse_place_floor',
    assessmentType: AssessmentType.MMSE,
    category: '定向力-地点',
    text: '咱们现在在第几层楼？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '任何合理的楼层数',
    grokPrompt: `评分标准(1分):
说出合理的楼层数即可。

返回JSON: {"score": 0或1, "reasoning": "楼层数是否合理"}`
  },

  // II. 记忆力 - 即刻记忆 (3分)
  {
    id: 'mmse_memory_immediate',
    assessmentType: AssessmentType.MMSE,
    category: '记忆力',
    text: '记忆三个词',
    subText: '我会说三个词，请仔细听并重复：皮球、国旗、树木',
    inputType: QuestionInputType.AUDIO,
    maxScore: 3,
    answerKey: '皮球、国旗、树木',
    grokPrompt: `评分标准(3分):
三个词: 皮球、国旗、树木

操作说明:
1. 告诉被测试者将检查记忆力
2. 清楚、缓慢地说出3个词(约1秒一个)
3. 被测试者首次重复的结果决定得分
4. 每答对1个得1分，最多3分
5. 如未全部记住，可重复最多5次

计分: 
- 首次复述正确数量 = 得分
- 说对"皮球"得1分
- 说对"国旗"得1分  
- 说对"树木"得1分

注意: 如果5次后仍未记住所有3个，则跳过后面的"回忆能力"检查。

转录音频，数清楚说对了几个词。
返回JSON: {"score": 0到3, "reasoning": "说出了哪几个词，共X个"}`
  },

  // III. 注意力和计算力 (5分)
  {
    id: 'mmse_serial7_1',
    assessmentType: AssessmentType.MMSE,
    category: '注意力和计算力',
    text: '100减7等于多少？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '93',
    grokPrompt: `评分标准(1分):
正确答案: 93

操作说明: 要求从100开始减7，连续减5次。
每答对1个得1分。
如果前次错了，但下一个答案是对的，也得1分。

返回JSON: {"score": 0或1, "reasoning": "答案是否为93"}`
  },
  {
    id: 'mmse_serial7_2',
    assessmentType: AssessmentType.MMSE,
    category: '注意力和计算力',
    text: '再减7等于多少？',
    subText: '从上一个答案继续减7',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '86（如果上题答对）',
    grokPrompt: `评分标准(1分):
如果上题答93: 正确答案是86
如果上题答错: 从错误答案正确减7也算对

注意: 即使前次错了，但这次计算正确(从前次答案减7正确)也得1分。

返回JSON: {"score": 0或1, "reasoning": "是否正确减7"}`
  },
  {
    id: 'mmse_serial7_3',
    assessmentType: AssessmentType.MMSE,
    category: '注意力和计算力',
    text: '再减7等于多少？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '79（如果前面都对）',
    grokPrompt: `评分标准(1分):
如果一直正确: 79
如果前面有错: 从上一个答案正确减7即可

返回JSON: {"score": 0或1, "reasoning": "减7计算是否正确"}`
  },
  {
    id: 'mmse_serial7_4',
    assessmentType: AssessmentType.MMSE,
    category: '注意力和计算力',
    text: '再减7等于多少？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '72（如果前面都对）',
    grokPrompt: `评分标准(1分):
如果一直正确: 72
从上一答案正确减7即算对

返回JSON: {"score": 0或1, "reasoning": "计算是否正确"}`
  },
  {
    id: 'mmse_serial7_5',
    assessmentType: AssessmentType.MMSE,
    category: '注意力和计算力',
    text: '最后再减7等于多少？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    answerKey: '65（如果前面都对）',
    grokPrompt: `评分标准(1分):
如果一直正确: 65
从上一答案正确减7即算对

返回JSON: {"score": 0或1, "reasoning": "最后一次减7是否正确"}`
  },

  // IV. 回忆能力 (3分)
  {
    id: 'mmse_memory_recall',
    assessmentType: AssessmentType.MMSE,
    category: '回忆能力',
    text: '词语回忆',
    subText: '请回忆刚才让你记住的三个词',
    inputType: QuestionInputType.AUDIO,
    maxScore: 3,
    answerKey: '皮球、国旗、树木',
    grokPrompt: `评分标准(3分):
三个词: 皮球、国旗、树木

操作说明:
- 如果前次被测试者完全记住了3个词，现在让他们再重复一遍
- 每正确重复1个得1分，最高3分
- 不论第18项(即刻记忆)完成情况如何，都要求复述一遍

计分:
- 回忆"皮球": 1分
- 回忆"国旗": 1分
- 回忆"树木": 1分

转录音频，检查回忆出哪几个词。
返回JSON: {"score": 0到3, "reasoning": "回忆出: [列出词语]，共X个词"}`
  },

  // V. 语言能力 - 命名 (2分)
  {
    id: 'mmse_naming_watch',
    assessmentType: AssessmentType.MMSE,
    category: '语言能力-命名',
    text: '看图命名',
    subText: '请看图片，这是什么？',
    imageReference: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400',
    inputType: QuestionInputType.AUDIO,
    maxScore: 1,
    answerKey: '手表 / 表',
    grokPrompt: `评分标准(1分):
正确答案: 手表/表/watch

操作说明: 给患者出示手表，能正确命名记1分。

接受: "手表""表""watch"
不接受: 含糊不清或错误

转录音频，检查命名。
返回JSON: {"score": 0或1, "reasoning": "命名是否正确"}`
  },
  {
    id: 'mmse_naming_pen',
    assessmentType: AssessmentType.MMSE,
    category: '语言能力-命名',
    text: '看图命名',
    subText: '请看图片，这是什么？',
    imageReference: 'https://images.unsplash.com/photo-1586158291800-2665f07bfa47?w=400',
    inputType: QuestionInputType.AUDIO,
    maxScore: 1,
    answerKey: '钢笔 / 笔',
    grokPrompt: `评分标准(1分):
正确答案: 钢笔/笔/pen

操作说明: 出示圆珠笔/钢笔，能正确命名记1分。

接受: "钢笔""笔""圆珠笔""pen"
不接受: 含糊不清

返回JSON: {"score": 0或1, "reasoning": "命名是否正确"}`
  },

  // V. 语言能力 - 复述 (1分)
  {
    id: 'mmse_repeat',
    assessmentType: AssessmentType.MMSE,
    category: '语言能力-复述',
    text: '语言复述',
    subText: '请跟我重复这句话："四十四只石狮子"（只能说一次）',
    inputType: QuestionInputType.AUDIO,
    maxScore: 1,
    answerKey: '四十四只石狮子',
    grokPrompt: `评分标准(1分):
正确句子: "四十四只石狮子"

操作说明:
- 检查语言复述能力
- 要求复述中等难度短句
- 调查员只能说一次
- 正确无误复述给1分
- 必须咬字清楚

严格要求: 一字不差且咬字清楚。

转录音频，检查复述准确性。
返回JSON: {"score": 0或1, "reasoning": "复述是否完全准确且咬字清楚"}`
  },

  // V. 语言能力 - 阅读 (1分)
  {
    id: 'mmse_read',
    assessmentType: AssessmentType.MMSE,
    category: '语言能力-阅读',
    text: '阅读理解',
    subText: '请看这句话并按照它的意思去做："闭上你的眼睛"',
    inputType: QuestionInputType.AUDIO,
    maxScore: 1,
    answerKey: '朗读并闭上眼睛',
    grokPrompt: `评分标准(1分):
要求: 让受访者看"闭上您的眼睛"的文字

操作说明:
1. 患者先朗读一遍
2. 然后按纸上命令去做
3. 患者能闭上双眼给1分

评分: 只有确实闭上眼睛才得分。

转录音频，检查是否:
1. 朗读了句子
2. 描述闭眼动作

返回JSON: {"score": 0或1, "reasoning": "是否朗读并闭眼"}`
  },

  // V. 语言能力 - 三步命令 (3分)
  {
    id: 'mmse_command',
    assessmentType: AssessmentType.MMSE,
    category: '语言能力-三步命令',
    text: '三步命令',
    subText: '请按照我说的做：用右手拿着这张纸，把它对折起来，放在您的左腿上',
    inputType: QuestionInputType.AUDIO,
    maxScore: 3,
    answerKey: '(1)右手拿纸 (2)对折 (3)放左腿',
    grokPrompt: `评分标准(3分):
三个动作:
1. 用右手拿纸 - 1分
2. 对折 - 1分
3. 放在左腿上 - 1分

操作说明:
- 准备一张白纸
- 把三个命令连续说完后受访者再做动作
- 不能重复或示范
- 只有按正确顺序做的动作才算正确
- 三个动作各得1分

评分: 每完成一个正确动作得1分。

转录音频，判断描述了几个正确步骤。
返回JSON: {"score": 0到3, "reasoning": "完成了哪几个步骤，每个是否正确"}`
  },

  // V. 语言能力 - 书写 (1分)
  {
    id: 'mmse_write',
    assessmentType: AssessmentType.MMSE,
    category: '语言能力-书写',
    text: '书写能力',
    subText: '请写一个完整的句子（拍照上传）',
    inputType: QuestionInputType.DRAWING,
    maxScore: 1,
    answerKey: '有主语和谓语的完整句子',
    grokPrompt: `评分标准(1分):
要求:
- 句子必须有主语和谓语
- 必须有意义，能被人理解
- 语法和标点符号不作要求

操作说明:
- 给白纸让其自发写句子
- 不能给予任何提示
- 语法和标点错误可忽略
- 如2分钟内写不出合格句子得0分

检查者不能口述句子让其书写。

分析图片，检查是否:
1. 有主语
2. 有谓语
3. 句子有意义

返回JSON: {"score": 0或1, "reasoning": "句子是否完整有意义"}`
  },

  // V. 语言能力 - 结构能力 (1分)
  {
    id: 'mmse_copy_pentagon',
    assessmentType: AssessmentType.MMSE,
    category: '结构能力',
    text: '临摹图形',
    subText: '请照着画出两个交叉的五边形',
    imageReference: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Interlocking_Pentagons.svg/320px-Interlocking_Pentagons.svg.png',
    inputType: QuestionInputType.DRAWING,
    maxScore: 1,
    answerKey: '两个相交五边形，交叉处形成四边形',
    grokPrompt: `评分标准(1分):
要求:
1. 五边形需画出5个清楚的角和5个边
2. 两个五边形必须交叉
3. 交叉处形成菱形(四边形)
4. 线条抖动和图形旋转可忽略

操作说明:
- 五边形各边长应在2.5cm左右(不强求)
- 必须是两个交叉的五边形
- 交叉图形必须是四边形
- 角不整齐和边不直可忽略

评分标准:
- 两个五边形: 各有5角5边
- 必须相交
- 交叉处是四边形

分析图片，严格检查以上要素。
返回JSON: {"score": 0或1, "reasoning": "详细说明图形是否符合所有要求"}`
  }
];

export const MMSE_MAX_SCORE = 30;
export const MMSE_NORMAL_CUTOFF = 27;
