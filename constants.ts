import { AssessmentType, Question, QuestionInputType } from './types';

// Simplified subset of questions for the demo to fit within context limits while showing all modalities.
export const QUESTIONS: Question[] = [
  // --- MMSE Section ---
  {
    id: 'mmse_time_year',
    assessmentType: AssessmentType.MMSE,
    category: '定向力 (Orientation)',
    text: '请问今年是哪一年？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    geminiPrompt: 'Validate if the user input matches the current year. Relaxed matching.'
  },
  {
    id: 'mmse_time_season',
    assessmentType: AssessmentType.MMSE,
    category: '定向力 (Orientation)',
    text: '现在是什么季节？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    geminiPrompt: 'Validate if the input is the correct season based on current date.'
  },
  {
    id: 'mmse_calc_100_7',
    assessmentType: AssessmentType.MMSE,
    category: '注意力和计算力 (Attention)',
    text: '计算题：100减7是多少？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    geminiPrompt: 'Check if answer is 93.'
  },
  {
    id: 'mmse_copy_pentagon',
    assessmentType: AssessmentType.MMSE,
    category: '结构能力 (Visuospatial)',
    text: '请在纸上画出两个相交的五边形（如下图所示），并拍照上传。',
    subText: '两个五边形必须相交，且相交处形成一个四边形。',
    imageReference: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Interlocking_Pentagons.svg/320px-Interlocking_Pentagons.svg.png',
    inputType: QuestionInputType.DRAWING,
    maxScore: 1,
    geminiPrompt: 'Analyze the uploaded image. Does it show two intersecting pentagons? Do they intersect to form a 4-sided shape? Score 1 if yes, 0 if no.'
  },

  // --- MoCA Section ---
  {
    id: 'moca_trail_making',
    assessmentType: AssessmentType.MOCA,
    category: '视空间/执行能力 (Visuospatial/Executive)',
    text: '连线任务：请按照 "1 -> 甲 -> 2 -> 乙 -> 3 -> 丙..." 的顺序在纸上连线，然后拍照上传。',
    inputType: QuestionInputType.DRAWING,
    maxScore: 1,
    geminiPrompt: 'Check if the alternating number-letter sequence is correct and lines do not cross incorrectly.'
  },
  {
    id: 'moca_naming_lion',
    assessmentType: AssessmentType.MOCA,
    category: '命名 (Naming)',
    text: '请按住麦克风，说出图片中动物的名字。',
    imageReference: 'https://images.pexels.com/photos/247502/pexels-photo-247502.jpeg?auto=compress&cs=tinysrgb&w=600', // Lion placeholder
    inputType: QuestionInputType.AUDIO,
    maxScore: 1,
    geminiPrompt: 'Listen to the audio. Did the user say "Lion" or "狮子"? Score 1 for yes.'
  },
  {
    id: 'moca_repeat_sentence_1',
    assessmentType: AssessmentType.MOCA,
    category: '语言 (Language)',
    text: '请复述这句话：“我只知道今天小张来帮忙。”',
    inputType: QuestionInputType.AUDIO,
    maxScore: 1,
    geminiPrompt: 'Transcribe the audio. Did the user repeat "我只知道今天小张来帮忙" exactly? Score 1 if exact match.'
  },
  {
    id: 'moca_fluency',
    assessmentType: AssessmentType.MOCA,
    category: '语言 (Language)',
    text: '请在1分钟内说出尽可能多以“水”字开头的词语（如水果、水晶）。请录音。',
    subText: '我们在本演示中缩短为15秒。',
    inputType: QuestionInputType.AUDIO,
    maxScore: 1,
    geminiPrompt: 'Count the number of unique valid Chinese words starting with "Shui" or related to the prompt provided in audio. If count >= 11 score 1, else 0. For this demo, if count > 3 score 1.'
  },
  {
    id: 'moca_abstraction',
    assessmentType: AssessmentType.MOCA,
    category: '抽象 (Abstraction)',
    text: '香蕉和橘子有什么共同点？',
    inputType: QuestionInputType.TEXT,
    maxScore: 1,
    geminiPrompt: 'Did the user answer "Fruits" or "水果"? Specific category is required. "Food" is not abstract enough.'
  },

  // --- ADL Section ---
  {
    id: 'adl_bus',
    assessmentType: AssessmentType.ADL,
    category: '日常生活能力 (ADL)',
    text: '自己搭乘公共汽车',
    inputType: QuestionInputType.CHOICE,
    options: ['1. 自己可以做', '2. 有些困难', '3. 需要帮助', '4. 根本无法做'],
    maxScore: 4 // Note: ADL scoring is inverse/categorical, but we store selection here
  },
  {
    id: 'adl_money',
    assessmentType: AssessmentType.ADL,
    category: '日常生活能力 (ADL)',
    text: '处理自己的钱财',
    inputType: QuestionInputType.CHOICE,
    options: ['1. 自己可以做', '2. 有些困难', '3. 需要帮助', '4. 根本无法做'],
    maxScore: 4
  },
  {
    id: 'adl_phone',
    assessmentType: AssessmentType.ADL,
    category: '日常生活能力 (ADL)',
    text: '打电话',
    inputType: QuestionInputType.CHOICE,
    options: ['1. 自己可以做', '2. 有些困难', '3. 需要帮助', '4. 根本无法做'],
    maxScore: 4
  }
];

export const MOCA_MAX_SCORE = 30;
export const MMSE_MAX_SCORE = 30;
export const ADL_CUTOFF = 26; // > 26 indicates decline