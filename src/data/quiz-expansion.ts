import { LESSONS_DATA } from './lessons';

/** Authored recognition practice. Language/answer approval is tracked separately. */
const specs = [
  [1, 109, 110, 111, 112],
  [2, 209, 210, 211, 212],
  [3, 309, 310, 311, 312],
  [4, 409, 410, 411, 412],
  [5, 509, 510, 511, 512],
  [6, 609, 610, 611, 612],
  [7, 709, 710, 711, 712],
  [8, 809, 810, 811, 812],
  [9, 909, 910, 911, 912],
  [10, 1009, 1010, 1011, 1012],
  [11, 1109, 1110, 1111, 1112],
  [12, 1209, 1210, 1211, 1212],
  [13, 1309, 1310, 1311, 1312],
  [14, 1409, 1410, 1411, 1412],
  [15, 1509, 1510, 1511, 1512],
] as const;

export const QUIZ_EXPANSION = specs.flatMap(([lessonId, ...questionIds]) => {
  const lesson = LESSONS_DATA[lessonId]!;
  const vocabulary = lesson.vocabulary.flatMap((pack) => pack.items);
  return questionIds.map((id, index) => {
    const suffix = String(lessonId).padStart(2, '0');
    const correctIndex = (lessonId + index) % 4;
    if (index < 2) {
      const targetId = `vocab-${suffix}-${String(index + 1).padStart(4, '0')}`;
      const target = vocabulary.find((item) => item.id === targetId)!;
      const correct = index === 0 ? target.vn : target.kr;
      const alternatives = [
        ...new Set(
          vocabulary
            .filter((item) => item.id !== targetId)
            .map((item) => (index === 0 ? item.vn : item.kr)),
        ),
      ]
        .filter((value) => value !== correct)
        .slice(0, 3);
      alternatives.splice(correctIndex, 0, correct);
      return {
        id,
        lessonId,
        type: 'recognition',
        skill: 'vocabulary',
        difficulty: 1,
        question:
          index === 0
            ? `Trong chủ đề ${lesson.koreanTitle}, “${target.kr}” có nghĩa là gì?`
            : `Chọn từ tiếng Hàn tương ứng với “${target.vn}”.`,
        options: alternatives,
        correctIndex,
        targetIds: [targetId],
        explanation: `${target.kr}: ${target.vn}. Ví dụ/cụm từ trong bài: ${target.note ?? ''}`,
        source:
          'TC3 authored recognition practice; derived from lesson vocabulary; pending language review',
      };
    }
    const targetId = `grammar-${suffix}-${String(index - 1).padStart(3, '0')}`;
    const target = lesson.grammar.find((item) => item.id === targetId)!;
    const alternatives = [
      'Nêu phép so sánh hơn nhất giữa ba đối tượng.',
      targetId === 'grammar-10-001'
        ? 'Nhấn mạnh nghĩa vụ bắt buộc thực hiện một hành động.'
        : 'Tường thuật một câu hỏi gián tiếp đã nghe.',
      'Diễn tả điều kiện trái với thực tế ở quá khứ.',
    ];
    alternatives.splice(correctIndex, 0, target.meaning);
    return {
      id,
      lessonId,
      type: 'recognition',
      skill: 'grammar',
      difficulty: 2,
      question: `Cấu trúc “${target.structure}” trong bài ${lessonId} thể hiện ý nghĩa nào?`,
      options: alternatives,
      correctIndex,
      targetIds: [targetId],
      explanation: `${target.meaning} ${target.rule} Ví dụ: ${target.examples[0]?.kr ?? ''}`,
      source:
        'TC3 authored recognition practice; derived from lesson grammar; pending language review',
    };
  });
});
