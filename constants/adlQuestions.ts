import { AssessmentType, Question, QuestionInputType } from '../types';

export const ADL_QUESTIONS: Question[] = [
  {
    id: 'adl_01_bus',
    assessmentType: AssessmentType.ADL,
    category: '日常生活能力',
    text: '1. 自己搭乘公共汽车',
    inputType: QuestionInputType.CHOICE,
    options: ['1. 自己可以做', '2. 有些困难', '3. 需要帮助', '4. 根本无法做'],
    maxScore: 4,
    answerKey: '1分=正常，2-4分=功能下降'
  },
  {
    id: 'adl_02_nearby',
    assessmentType: AssessmentType.ADL,
    category: '日常生活能力',
    text: '2. 在住地附近活动',
    inputType: QuestionInputType.CHOICE,
    options: ['1. 自己可以做', '2. 有些困难', '3. 需要帮助', '4. 根本无法做'],
    maxScore: 4,
    answerKey: '1分=正常'
  },
  {
    id: 'adl_03_cook_fire',
    assessmentType: AssessmentType.ADL,
    category: '日常生活能力',
    text: '3. 自己做饭（包括生火）',
    inputType: QuestionInputType.CHOICE,
    options: ['1. 自己可以做', '2. 有些困难', '3. 需要帮助', '4. 根本无法做'],
    maxScore: 4,
    answerKey: '1分=正常'
  },
  {
    id: 'adl_04_housework',
    assessmentType: AssessmentType.ADL,
    category: '日常生活能力',
    text: '4. 做家务',
    inputType: QuestionInputType.CHOICE,
    options: ['1. 自己可以做', '2. 有些困难', '3. 需要帮助', '4. 根本无法做'],
    maxScore: 4,
    answerKey: '1分=正常'
  },
  {
    id: 'adl_05_medicine',
    assessmentType: AssessmentType.ADL,
    category: '日常生活能力',
    text: '5. 吃药',
    inputType: QuestionInputType.CHOICE,
    options: ['1. 自己可以做', '2. 有些困难', '3. 需要帮助', '4. 根本无法做'],
    maxScore: 4,
    answerKey: '1分=正常'
  },
  {
    id: 'adl_06_eating',
    assessmentType: AssessmentType.ADL,
    category: '日常生活能力',
    text: '6. 吃饭',
    inputType: QuestionInputType.CHOICE,
    options: ['1. 自己可以做', '2. 有些困难', '3. 需要帮助', '4. 根本无法做'],
    maxScore: 4,
    answerKey: '1分=正常'
  },
  {
    id: 'adl_07_dressing',
    assessmentType: AssessmentType.ADL,
    category: '日常生活能力',
    text: '7. 穿衣服、脱衣服',
    inputType: QuestionInputType.CHOICE,
    options: ['1. 自己可以做', '2. 有些困难', '3. 需要帮助', '4. 根本无法做'],
    maxScore: 4,
    answerKey: '1分=正常'
  },
  {
    id: 'adl_08_grooming',
    assessmentType: AssessmentType.ADL,
    category: '日常生活能力',
    text: '8. 梳头、刷牙等',
    inputType: QuestionInputType.CHOICE,
    options: ['1. 自己可以做', '2. 有些困难', '3. 需要帮助', '4. 根本无法做'],
    maxScore: 4,
    answerKey: '1分=正常'
  },
  {
    id: 'adl_09_laundry',
    assessmentType: AssessmentType.ADL,
    category: '日常生活能力',
    text: '9. 洗自己的衣服',
    inputType: QuestionInputType.CHOICE,
    options: ['1. 自己可以做', '2. 有些困难', '3. 需要帮助', '4. 根本无法做'],
    maxScore: 4,
    answerKey: '1分=正常'
  },
  {
    id: 'adl_10_walk_indoor',
    assessmentType: AssessmentType.ADL,
    category: '日常生活能力',
    text: '10. 在平坦的室内走',
    inputType: QuestionInputType.CHOICE,
    options: ['1. 自己可以做', '2. 有些困难', '3. 需要帮助', '4. 根本无法做'],
    maxScore: 4,
    answerKey: '1分=正常'
  },
  {
    id: 'adl_11_stairs',
    assessmentType: AssessmentType.ADL,
    category: '日常生活能力',
    text: '11. 上下楼梯',
    inputType: QuestionInputType.CHOICE,
    options: ['1. 自己可以做', '2. 有些困难', '3. 需要帮助', '4. 根本无法做'],
    maxScore: 4,
    answerKey: '1分=正常'
  },
  {
    id: 'adl_12_bed_chair',
    assessmentType: AssessmentType.ADL,
    category: '日常生活能力',
    text: '12. 上下床、坐下或站起',
    inputType: QuestionInputType.CHOICE,
    options: ['1. 自己可以做', '2. 有些困难', '3. 需要帮助', '4. 根本无法做'],
    maxScore: 4,
    answerKey: '1分=正常'
  },
  {
    id: 'adl_13_prepare_meal',
    assessmentType: AssessmentType.ADL,
    category: '日常生活能力',
    text: '13. 做饭',
    inputType: QuestionInputType.CHOICE,
    options: ['1. 自己可以做', '2. 有些困难', '3. 需要帮助', '4. 根本无法做'],
    maxScore: 4,
    answerKey: '1分=正常'
  },
  {
    id: 'adl_14_bathing',
    assessmentType: AssessmentType.ADL,
    category: '日常生活能力',
    text: '14. 洗澡',
    inputType: QuestionInputType.CHOICE,
    options: ['1. 自己可以做', '2. 有些困难', '3. 需要帮助', '4. 根本无法做'],
    maxScore: 4,
    answerKey: '1分=正常'
  },
  {
    id: 'adl_15_toenails',
    assessmentType: AssessmentType.ADL,
    category: '日常生活能力',
    text: '15. 剪脚趾甲',
    inputType: QuestionInputType.CHOICE,
    options: ['1. 自己可以做', '2. 有些困难', '3. 需要帮助', '4. 根本无法做'],
    maxScore: 4,
    answerKey: '1分=正常'
  },
  {
    id: 'adl_16_shopping',
    assessmentType: AssessmentType.ADL,
    category: '日常生活能力',
    text: '16. 逛街、购物',
    inputType: QuestionInputType.CHOICE,
    options: ['1. 自己可以做', '2. 有些困难', '3. 需要帮助', '4. 根本无法做'],
    maxScore: 4,
    answerKey: '1分=正常'
  },
  {
    id: 'adl_17_toilet',
    assessmentType: AssessmentType.ADL,
    category: '日常生活能力',
    text: '17. 上厕所',
    inputType: QuestionInputType.CHOICE,
    options: ['1. 自己可以做', '2. 有些困难', '3. 需要帮助', '4. 根本无法做'],
    maxScore: 4,
    answerKey: '1分=正常'
  },
  {
    id: 'adl_18_phone',
    assessmentType: AssessmentType.ADL,
    category: '日常生活能力',
    text: '18. 打电话',
    inputType: QuestionInputType.CHOICE,
    options: ['1. 自己可以做', '2. 有些困难', '3. 需要帮助', '4. 根本无法做'],
    maxScore: 4,
    answerKey: '1分=正常'
  },
  {
    id: 'adl_19_money',
    assessmentType: AssessmentType.ADL,
    category: '日常生活能力',
    text: '19. 处理自己的钱财',
    inputType: QuestionInputType.CHOICE,
    options: ['1. 自己可以做', '2. 有些困难', '3. 需要帮助', '4. 根本无法做'],
    maxScore: 4,
    answerKey: '1分=正常'
  },
  {
    id: 'adl_20_alone',
    assessmentType: AssessmentType.ADL,
    category: '日常生活能力',
    text: '20. 独自在家',
    inputType: QuestionInputType.CHOICE,
    options: ['1. 自己可以做', '2. 有些困难', '3. 需要帮助', '4. 根本无法做'],
    maxScore: 4,
    answerKey: '1分=正常'
  }
];

export const ADL_MAX_SCORE = 80;
export const ADL_NORMAL_CUTOFF = 26;
