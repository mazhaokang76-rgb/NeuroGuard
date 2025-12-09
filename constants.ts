import { AssessmentType, Question, QuestionInputType } from './types';

export const ADL_CUTOFF = 26;

export const QUESTIONS: Question[] = [
  // ==================== MMSE 量表 (30分) ====================
  // 定向力 - 时间 (5分)
  {
    id: 'mmse_time_year',
    assessmentType: AssessmentType.MMSE,
    category: '定向力-时间',
    text: '今年是哪一年？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    grokPrompt: 'Check if answer is 2025 or similar. Score 1 if correct, 0 if wrong.'
  },
  {
    id: 'mmse_time_season',
    assessmentType: AssessmentType.MMSE,
    category: '定向力-时间',
    text: '现在是什么季节？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    grokPrompt: 'Check if answer is winter/冬季/冬天 (December). Score 1 if correct.'
  },
  {
    id: 'mmse_time_month',
    assessmentType: AssessmentType.MMSE,
    category: '定向力-时间',
    text: '现在是几月份？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    grokPrompt: 'Check if answer is 12月/December/十二月. Score 1 if correct.'
  },
  {
    id: 'mmse_time_date',
    assessmentType: AssessmentType.MMSE,
    category: '定向力-时间',
    text: '今天是几号？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    grokPrompt: 'Check if answer matches today\'s date in December 2025. Score 1 if approximately correct.'
  },
  {
    id: 'mmse_time_day',
    assessmentType: AssessmentType.MMSE,
    category: '定向力-时间',
    text: '今天是星期几？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    grokPrompt: 'Check if answer is correct day of week. Score 1 if correct.'
  },
  
  // 定向力 - 地点 (5分)
  {
    id: 'mmse_place_province',
    assessmentType: AssessmentType.MMSE,
    category: '定向力-地点',
    text: '你住在哪个省？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    grokPrompt: 'Check if answer is a valid Chinese province name. Score 1 if reasonable answer.'
  },
  {
    id: 'mmse_place_county',
    assessmentType: AssessmentType.MMSE,
    category: '定向力-地点',
    text: '你住在哪个县（区）？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    grokPrompt: 'Check if answer is a reasonable district/county name. Score 1 if reasonable.'
  },
  {
    id: 'mmse_place_street',
    assessmentType: AssessmentType.MMSE,
    category: '定向力-地点',
    text: '你住在哪个乡（街道）？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    grokPrompt: 'Check if answer is a reasonable street/township name. Score 1 if reasonable.'
  },
  {
    id: 'mmse_place_hospital',
    assessmentType: AssessmentType.MMSE,
    category: '定向力-地点',
    text: '咱们现在在哪个医院？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    grokPrompt: 'Check if answer mentions hospital/home/clinic or reasonable location. Score 1 if reasonable.'
  },
  {
    id: 'mmse_place_floor',
    assessmentType: AssessmentType.MMSE,
    category: '定向力-地点',
    text: '咱们现在在第几层楼？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    grokPrompt: 'Check if answer is a floor number. Score 1 if reasonable number.'
  },

  // 记忆力 (3分)
  {
    id: 'mmse_memory_immediate',
    assessmentType: AssessmentType.MMSE,
    category: '记忆力',
    text: '我说三个词：皮球、国旗、树木。请你重复一遍。',
    subText: '请准确重复这三个词',
    inputType: QuestionInputType.AUDIO,
    maxScore: 3,
    grokPrompt: 'Transcribe audio. Count how many of these words are mentioned: 皮球, 国旗, 树木. Score = count (0-3).'
  },

  // 注意力和计算力 (5分)
  {
    id: 'mmse_calc_100_7_1',
    assessmentType: AssessmentType.MMSE,
    category: '注意力和计算力',
    text: '100减7是多少？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    grokPrompt: 'Check if answer is 93. Score 1 if correct.'
  },
  {
    id: 'mmse_calc_100_7_2',
    assessmentType: AssessmentType.MMSE,
    category: '注意力和计算力',
    text: '再减7是多少？（93-7）',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    grokPrompt: 'Check if answer is 86. Score 1 if correct.'
  },
  {
    id: 'mmse_calc_100_7_3',
    assessmentType: AssessmentType.MMSE,
    category: '注意力和计算力',
    text: '再减7是多少？（86-7）',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    grokPrompt: 'Check if answer is 79. Score 1 if correct.'
  },
  {
    id: 'mmse_calc_100_7_4',
    assessmentType: AssessmentType.MMSE,
    category: '注意力和计算力',
    text: '再减7是多少？（79-7）',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    grokPrompt: 'Check if answer is 72. Score 1 if correct.'
  },
  {
    id: 'mmse_calc_100_7_5',
    assessmentType: AssessmentType.MMSE,
    category: '注意力和计算力',
    text: '最后再减7是多少？（72-7）',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    grokPrompt: 'Check if answer is 65. Score 1 if correct.'
  },

  // 回忆能力 (3分)
  {
    id: 'mmse_memory_recall',
    assessmentType: AssessmentType.MMSE,
    category: '回忆能力',
    text: '现在请你说出我刚才让你记住的那三个词。',
    subText: '回忆：皮球、国旗、树木',
    inputType: QuestionInputType.AUDIO,
    maxScore: 3,
    grokPrompt: 'Transcribe audio. Count how many of these words are recalled: 皮球, 国旗, 树木. Score = count (0-3).'
  },

  // 语言能力 - 命名 (2分)
  {
    id: 'mmse_naming_watch',
    assessmentType: AssessmentType.MMSE,
    category: '语言能力-命名',
    text: '请看图片，这个是什么东西？',
    imageReference: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400',
    inputType: QuestionInputType.AUDIO,
    maxScore: 1,
    grokPrompt: 'Transcribe audio. Check if mentions watch/手表/表. Score 1 if correct.'
  },
  {
    id: 'mmse_naming_pen',
    assessmentType: AssessmentType.MMSE,
    category: '语言能力-命名',
    text: '请看图片，这个是什么东西？',
    imageReference: 'https://images.unsplash.com/photo-1586158291800-2665f07bfa47?w=400',
    inputType: QuestionInputType.AUDIO,
    maxScore: 1,
    grokPrompt: 'Transcribe audio. Check if mentions pen/钢笔/笔. Score 1 if correct.'
  },

  // 语言能力 - 复述 (1分)
  {
    id: 'mmse_repeat',
    assessmentType: AssessmentType.MMSE,
    category: '语言能力-复述',
    text: '请跟我重复这句话："四十四只石狮子"',
    inputType: QuestionInputType.AUDIO,
    maxScore: 1,
    grokPrompt: 'Transcribe audio. Check if accurately repeats "四十四只石狮子". Score 1 if close/accurate.'
  },

  // 语言能力 - 阅读 (1分)
  {
    id: 'mmse_read',
    assessmentType: AssessmentType.MMSE,
    category: '语言能力-阅读',
    text: '请念出这句话并按上面的意思做："闭上你的眼睛"',
    subText: '请大声念出并执行',
    inputType: QuestionInputType.AUDIO,
    maxScore: 1,
    grokPrompt: 'Transcribe audio. Check if reads "闭上你的眼睛" or similar. Score 1 if correct reading.'
  },

  // 语言能力 - 三步命令 (3分)
  {
    id: 'mmse_command',
    assessmentType: AssessmentType.MMSE,
    category: '语言能力-三步命令',
    text: '请按照我说的做：用右手拿着这张纸，用两只手将它对折起来，放在您的左腿上。',
    subText: '请录音描述你完成的步骤',
    inputType: QuestionInputType.AUDIO,
    maxScore: 3,
    grokPrompt: 'Transcribe audio. Count steps mentioned: (1)right hand take paper, (2)fold with both hands, (3)place on left leg. Score = steps completed (0-3).'
  },

  // 语言能力 - 书写 (1分)
  {
    id: 'mmse_write',
    assessmentType: AssessmentType.MMSE,
    category: '语言能力-书写',
    text: '请写一个完整的句子（拍照上传）',
    subText: '要求有主语和谓语',
    inputType: QuestionInputType.DRAWING,
    maxScore: 1,
    grokPrompt: 'Analyze image. Check if contains a complete Chinese sentence with subject and predicate. Score 1 if yes.'
  },

  // 结构能力 (1分)
  {
    id: 'mmse_copy_pentagon',
    assessmentType: AssessmentType.MMSE,
    category: '结构能力',
    text: '请照着画出两个相交的五边形（拍照上传）',
    imageReference: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Interlocking_Pentagons.svg/320px-Interlocking_Pentagons.svg.png',
    subText: '两个五边形必须相交',
    inputType: QuestionInputType.DRAWING,
    maxScore: 1,
    grokPrompt: 'Analyze image. Check if shows two intersecting pentagons forming a quadrilateral at intersection. Score 1 if yes, 0 if no.'
  },

  // ==================== MoCA 量表 (30分) ====================
  // 视空间/执行能力 - 连线 (1分)
  {
    id: 'moca_trail',
    assessmentType: AssessmentType.MOCA,
    category: '视空间/执行能力',
    text: '连线任务：按 1→甲→2→乙→3→丙→4→丁→5 顺序连线（拍照上传）',
    inputType: QuestionInputType.DRAWING,
    maxScore: 1,
    grokPrompt: 'Analyze image. Check if alternating number-Chinese sequence (1-甲-2-乙-3-丙-4-丁-5) is correct. Score 1 if correct.'
  },

  // 视空间/执行能力 - 立方体 (1分)
  {
    id: 'moca_cube',
    assessmentType: AssessmentType.MOCA,
    category: '视空间/执行能力',
    text: '请照着画出这个立方体（拍照上传）',
    imageReference: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Necker_cube.svg/240px-Necker_cube.svg.png',
    inputType: QuestionInputType.DRAWING,
    maxScore: 1,
    grokPrompt: 'Analyze image. Check if cube is drawn correctly with 3D perspective. Score 1 if reasonable cube.'
  },

  // 视空间/执行能力 - 画钟 (3分)
  {
    id: 'moca_clock',
    assessmentType: AssessmentType.MOCA,
    category: '视空间/执行能力-画钟',
    text: '请画一个钟表，指针指向11点10分（拍照上传）',
    subText: '需要画出轮廓、数字和指针',
    inputType: QuestionInputType.DRAWING,
    maxScore: 3,
    grokPrompt: 'Analyze clock image. Score: 1 point for circle contour, 1 point for numbers 1-12, 1 point for hands at 11:10 (hour near 11, minute at 2). Total 0-3 points.'
  },

  // 命名 (3分)
  {
    id: 'moca_naming_lion',
    assessmentType: AssessmentType.MOCA,
    category: '命名',
    text: '请说出图片中动物的名字',
    imageReference: 'https://images.pexels.com/photos/247502/pexels-photo-247502.jpeg?w=400',
    inputType: QuestionInputType.AUDIO,
    maxScore: 1,
    grokPrompt: 'Transcribe audio. Check if says lion/狮子. Score 1 if correct.'
  },
  {
    id: 'moca_naming_rhino',
    assessmentType: AssessmentType.MOCA,
    category: '命名',
    text: '请说出图片中动物的名字',
    imageReference: 'https://images.pexels.com/photos/63287/pexels-photo-63287.jpeg?w=400',
    inputType: QuestionInputType.AUDIO,
    maxScore: 1,
    grokPrompt: 'Transcribe audio. Check if says rhino/犀牛. Score 1 if correct.'
  },
  {
    id: 'moca_naming_camel',
    assessmentType: AssessmentType.MOCA,
    category: '命名',
    text: '请说出图片中动物的名字',
    imageReference: 'https://images.pexels.com/photos/2361952/pexels-photo-2361952.jpeg?w=400',
    inputType: QuestionInputType.AUDIO,
    maxScore: 1,
    grokPrompt: 'Transcribe audio. Check if says camel/骆驼. Score 1 if correct.'
  },

  // 记忆 - 即时 (不计分，用于延迟回忆)
  {
    id: 'moca_memory_learn',
    assessmentType: AssessmentType.MOCA,
    category: '记忆',
    text: '我说5个词，请重复：面孔、丝绒、寺庙、菊花、红色',
    subText: '请录音重复，稍后会再问',
    inputType: QuestionInputType.AUDIO,
    maxScore: 0,
    grokPrompt: 'Learning trial, no score. Just store for later recall.'
  },

  // 注意力 - 顺背 (1分)
  {
    id: 'moca_attention_forward',
    assessmentType: AssessmentType.MOCA,
    category: '注意力-顺背数字',
    text: '请重复这串数字：2 1 8 5 4',
    inputType: QuestionInputType.AUDIO,
    maxScore: 1,
    grokPrompt: 'Transcribe audio. Check if repeats 2-1-8-5-4 correctly. Score 1 if correct.'
  },

  // 注意力 - 倒背 (1分)
  {
    id: 'moca_attention_backward',
    assessmentType: AssessmentType.MOCA,
    category: '注意力-倒背数字',
    text: '请倒着重复这串数字：7 4 2',
    subText: '正确答案应该是：2 4 7',
    inputType: QuestionInputType.AUDIO,
    maxScore: 1,
    grokPrompt: 'Transcribe audio. Check if says 2-4-7 (reversed). Score 1 if correct.'
  },

  // 注意力 - 敲桌子 (1分)
  {
    id: 'moca_attention_tap',
    assessmentType: AssessmentType.MOCA,
    category: '注意力-警觉性',
    text: '当听到数字"1"时，请说"敲"。数字序列：5 2 1 3 9 4 1 1 8 0 6 2 1 5 1 9',
    subText: '数字1出现5次，应说5次"敲"',
    inputType: QuestionInputType.AUDIO,
    maxScore: 1,
    grokPrompt: 'Transcribe audio. Count "敲/knock/tap". Should be 5 times. Score 1 if 4-5 correct, 0 if <4.'
  },

  // 注意力 - 连续减7 (3分)
  {
    id: 'moca_attention_serial7',
    assessmentType: AssessmentType.MOCA,
    category: '注意力-计算',
    text: '从100开始，连续减7，说出5个答案',
    subText: '正确答案：93, 86, 79, 72, 65',
    inputType: QuestionInputType.AUDIO,
    maxScore: 3,
    grokPrompt: 'Transcribe audio. Count correct answers from 93, 86, 79, 72, 65. Score: 4-5 correct=3pts, 2-3 correct=2pts, 1 correct=1pt, 0 correct=0pts.'
  },

  // 语言 - 复述 (2分)
  {
    id: 'moca_repeat_1',
    assessmentType: AssessmentType.MOCA,
    category: '语言-复述',
    text: '请复述："我只知道今天小张来帮忙"',
    inputType: QuestionInputType.AUDIO,
    maxScore: 1,
    grokPrompt: 'Transcribe audio. Check if accurately repeats "我只知道今天小张来帮忙". Score 1 if close/accurate.'
  },
  {
    id: 'moca_repeat_2',
    assessmentType: AssessmentType.MOCA,
    category: '语言-复述',
    text: '请复述："狗在房间时，猫总躲在沙发下面"',
    inputType: QuestionInputType.AUDIO,
    maxScore: 1,
    grokPrompt: 'Transcribe audio. Check if accurately repeats "狗在房间时，猫总躲在沙发下面". Score 1 if close/accurate.'
  },

  // 语言 - 流畅性 (1分)
  {
    id: 'moca_fluency',
    assessmentType: AssessmentType.MOCA,
    category: '语言-流畅性',
    text: '请在30秒内说出尽可能多以"yi"音开头的词（如医生、衣服、椅子）',
    subText: '需要说出11个以上',
    inputType: QuestionInputType.AUDIO,
    maxScore: 1,
    grokPrompt: 'Transcribe audio. Count unique Chinese words starting with "yi" sound. Score 1 if >=11 words, 0 if <11.'
  },

  // 抽象 (2分)
  {
    id: 'moca_abstraction_1',
    assessmentType: AssessmentType.MOCA,
    category: '抽象',
    text: '火车和自行车有什么共同点？',
    subText: '正确答案应该是：交通工具',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    grokPrompt: 'Check if answer is category like "transportation/交通工具/vehicle". Score 1 if correct category.'
  },
  {
    id: 'moca_abstraction_2',
    assessmentType: AssessmentType.MOCA,
    category: '抽象',
    text: '手表和直尺有什么共同点？',
    subText: '正确答案应该是：测量工具',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    grokPrompt: 'Check if answer is category like "measuring tools/测量工具/instrument". Score 1 if correct category.'
  },

  // 延迟回忆 (5分)
  {
    id: 'moca_memory_recall',
    assessmentType: AssessmentType.MOCA,
    category: '延迟回忆',
    text: '请回忆之前让你记住的5个词',
    subText: '正确答案：面孔、丝绒、寺庙、菊花、红色',
    inputType: QuestionInputType.AUDIO,
    maxScore: 5,
    grokPrompt: 'Transcribe audio. Count recalled words: 面孔, 丝绒, 寺庙, 菊花, 红色. Score = count (0-5).'
  },

  // 定向力 (6分)
  {
    id: 'moca_orientation_date',
    assessmentType: AssessmentType.MOCA,
    category: '定向力',
    text: '今天是几号？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    grokPrompt: 'Check if date is approximately correct for December 2025. Score 1 if close.'
  },
  {
    id: 'moca_orientation_month',
    assessmentType: AssessmentType.MOCA,
    category: '定向力',
    text: '现在是几月？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    grokPrompt: 'Check if answer is 12/December/十二月. Score 1 if correct.'
  },
  {
    id: 'moca_orientation_year',
    assessmentType: AssessmentType.MOCA,
    category: '定向力',
    text: '今年是哪一年？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    grokPrompt: 'Check if answer is 2025. Score 1 if correct.'
  },
  {
    id: 'moca_orientation_day',
    assessmentType: AssessmentType.MOCA,
    category: '定向力',
    text: '今天是星期几？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    grokPrompt: 'Check if answer is correct day of week. Score 1 if correct.'
  },
  {
    id: 'moca_orientation_place',
    assessmentType: AssessmentType.MOCA,
    category: '定向力',
    text: '我们现在在什么地点？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    grokPrompt: 'Check if answer mentions hospital/clinic/home or reasonable location. Score 1 if reasonable.'
  },
  {
    id: 'moca_orientation_city',
    assessmentType: AssessmentType.MOCA,
    category: '定向力',
    text: '我们现在在哪个城市？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    grokPrompt: 'Check if answer is a valid city name. Score 1 if reasonable.'
  },

  // ==================== ADL 量表 (20项 x 4分 = 80分) ====================
  {
    id: 'adl_bus',
    assessmentType: AssessmentType.ADL,
    category: '日常生活能力',
    text: '1. 自己搭乘公共汽车',
    inputType: QuestionInputType.CHOICE,
    options: ['1. 自己可以做', '2. 有些困难', '3. 需要帮助', '4. 根本无法做'],
    maxScore: 4
  },
  {
    id: 'adl_nearby',
    assessmentType: AssessmentType.ADL,
    category: '日常生活能力',
    text: '2. 在住地附近活动',
    inputType: QuestionInputType.CHOICE,
    options: ['1. 自己可以做', '2. 有些困难', '3. 需要帮助', '4. 根本无法做'],
    maxScore: 4
  },
  {
    id: 'adl_cook_fire',
    assessmentType: AssessmentType.ADL,
    category: '日常生活能力',
    text: '3. 自己做饭（包括生火）',
    inputType: QuestionInputType.CHOICE,
    options: ['1. 自己可以做', '2. 有些困难', '3. 需要帮助', '4. 根本无法做'],
    maxScore: 4
  },
  {
    id: 'adl_housework',
    assessmentType: AssessmentType.ADL,
    category: '日常生活能力',
    text: '4. 做家务',
    inputType: QuestionInputType.CHOICE,
    options: ['1. 自己可以做', '2. 有些困难', '3. 需要帮助', '4. 根本无法做'],
    maxScore: 4
  },
  {
    id: 'adl_medicine',
    assessmentType: AssessmentType.ADL,
    category: '日常生活能力',
    text: '5. 吃药',
    inputType: QuestionInputType.CHOICE,
    options: ['1. 自己可以做', '2. 有些困难', '3. 需要帮助', '4. 根本无法做'],
    maxScore: 4
  },
  {
    id: 'adl_eating',
    assessmentType: AssessmentType.ADL,
    category: '日常生活能力',
    text: '6. 吃饭',
    inputType: QuestionInputType.CHOICE,
    options: ['1. 自己可以做', '2. 有些困难', '3. 需要帮助', '4. 根本无法做'],
    maxScore: 4
  },
  {
    id: 'adl_dressing',
    assessmentType: AssessmentType.ADL,
    category: '日常生活能力',
    text: '7. 穿衣服、脱衣服',
    inputType: QuestionInputType.CHOICE,
    options: ['1. 自己可以做', '2. 有些困难', '3. 需要帮助', '4. 根本无法做'],
    maxScore: 4
  },
  {
    id: 'adl_grooming',
    assessmentType: AssessmentType.ADL,
    category: '日常生活能力',
    text: '8. 梳头、刷牙等',
    inputType: QuestionInputType.CHOICE,
    options: ['1. 自己可以做', '2. 有些困难', '3. 需要帮助', '4. 根本无法做'],
    maxScore: 4
  },
  {
    id: 'adl_laundry',
    assessmentType: AssessmentType.ADL,
    category: '日常生活能力',
    text: '9. 洗自己的衣服',
    inputType: QuestionInputType.CHOICE,
    options: ['1. 自己可以做', '2. 有些困难', '3. 需要帮助', '4. 根本无法做'],
    maxScore: 4
  },
  {
    id: 'adl_walk__indoor',
    assessmentType: AssessmentType.ADL,
    category: '日常生活能力',
    text: '10. 在平坦的室内走',
    inputType: QuestionInputType.CHOICE,
    options: ['1. 自己可以做', '2. 有些困难', '3. 需要帮助', '4. 根本无法做'],
    maxScore: 4
  },
  {
    id: 'adl_stairs',
    assessmentType: AssessmentType.ADL,
    category: '日常生活能力',
    text: '11. 上下楼梯',
    inputType: QuestionInputType.CHOICE,
    options: ['1. 自己可以做', '2. 有些困难', '3. 需要帮助', '4. 根本无法做'],
    maxScore: 4
  },
  {
    id: 'adl_bed_chair',
    assessmentType: AssessmentType.ADL,
    category: '日常生活能力',
    text: '12. 上下床、坐下或站起',
    inputType: QuestionInputType.CHOICE,
    options: ['1. 自己可以做', '2. 有些困难', '3. 需要帮助', '4. 根本无法做'],
    maxScore: 4
  },
  {
    id: 'adl_prepare_meal',
    assessmentType: AssessmentType.ADL,
    category: '日常生活能力',
    text: '13. 做饭',
    inputType: QuestionInputType.CHOICE,
    options: ['1. 自己可以做', '2. 有些困难', '3. 需要帮助', '4. 根本无法做'],
    maxScore: 4
  },
  {
    id: 'adl_bathing',
    assessmentType: AssessmentType.ADL,
    category: '日常生活能力',
    text: '14. 洗澡',
    inputType: QuestionInputType.CHOICE,
    options: ['1. 自己可以做', '2. 有些困难', '3. 需要帮助', '4. 根本无法做'],
    maxScore: 4
  },
  {
    id: 'adl_toenails',
    assessmentType: AssessmentType.ADL,
    category: '日常生活能力',
    text: '15. 剪脚趾甲',
    inputType: QuestionInputType.CHOICE,
    options: ['1. 自己可以做', '2. 有些困难', '3. 需要帮助', '4. 根本无法做'],
    maxScore: 4
  },
  {
    id: 'adl_shopping',
    assessmentType: AssessmentType.ADL,
    category: '日常生活能力',
    text: '16. 逛街、购物',
    inputType: QuestionInputType.CHOICE,
    options: ['1. 自己可以做', '2. 有些困难', '3. 需要帮助', '4. 根本无法做'],
    maxScore: 4
  },
  {
    id: 'adl_toilet',
    assessmentType: AssessmentType.ADL,
    category: '日常生活能力',
    text: '17. 上厕所',
    inputType: QuestionInputType.CHOICE,
    options: ['1. 自己可以做', '2. 有些困难', '3. 需要帮助', '4. 根本无法做'],
    maxScore: 4
  },
  {
    id: 'adl_phone',
    assessmentType: AssessmentType.ADL,
    category: '日常生活能力',
    text: '18. 打电话',
    inputType: QuestionInputType.CHOICE,
    options: ['1. 自己可以做', '2. 有些困难', '3. 需要帮助', '4. 根本无法做'],
    maxScore: 4
  },
  {
    id: 'adl_money',
    assessmentType: AssessmentType.ADL,
    category: '日常生活能力',
    text: '19. 处理自己的钱财',
    inputType: QuestionInputType.CHOICE,
    options: ['1. 自己可以做', '2. 有些困难', '3. 需要帮助', '4. 根本无法做'],
    maxScore: 4
  },
  {
    id: 'adl_alone',
    assessmentType: AssessmentType.ADL,
    category: '日常生活能力',
    text: '20. 独自在家',
    inputType: QuestionInputType.CHOICE,
    options: ['1. 自己可以做', '2. 有些困难', '3. 需要帮助', '4. 根本无法做'],
    maxScore: 4
  }
];</parameter>
