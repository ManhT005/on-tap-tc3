import { LESSONS_DATA } from '../src/data/lessons';
import { QUIZ_BANK } from '../src/data/quiz-bank';
import { READING_BANK } from '../src/data/reading-bank';
import { WRITING_BANK } from '../src/data/writing-bank';

const rows = [
  '| Bài | Từ vựng | Ngữ pháp | Quiz (mục tiêu 12) | Reading (mục tiêu 2) | Listening (mục tiêu 2) | Writing (mục tiêu 2) | Culture | Khoảng trống chính |',
  '|---:|---:|---:|---:|---:|---:|---:|:---:|---|',
];

for (let lessonId = 1; lessonId <= 15; lessonId += 1) {
  const lesson = LESSONS_DATA[lessonId];
  if (!lesson) throw new Error(`Missing lesson data for ${lessonId}`);

  const vocabularyCount = lesson.vocabulary.flatMap((pack) => pack.items).length;
  const grammarCount = lesson.grammar.length;
  const quizCount = QUIZ_BANK.filter((question) => question.lessonId === lessonId).length;
  const readingCount = (READING_BANK[String(lessonId)] ?? []).length;
  const writingCount = WRITING_BANK.filter((prompt) => prompt.lessonId === lessonId).length;
  const gaps = [
    quizCount < 12 ? 'Quiz' : '',
    readingCount < 2 ? 'Reading' : '',
    'Listening',
    writingCount < 2 ? 'Writing' : '',
  ].filter(Boolean);

  rows.push(
    `| ${String(lessonId).padStart(2, '0')} | ${vocabularyCount} | ${grammarCount} | ${quizCount}/12 | ${readingCount}/2 | 0/2 | ${writingCount}/2 | Có | ${gaps.join(', ')} |`,
  );
}

console.log(rows.join('\n'));
