import { COURSE_STRUCTURE } from '../src/data/course';
import { LESSONS_DATA } from '../src/data/lessons';
import { QUIZ_BANK } from '../src/data/quiz-bank';
import { READING_BANK } from '../src/data/reading-bank';
import { WRITING_BANK } from '../src/data/writing-bank';

const issues: string[] = [];

function checkDuplicateIds(items: { id: string | number }[], file: string) {
  const seen = new Set<string | number>();

  for (const item of items) {
    if (seen.has(item.id)) {
      issues.push(`${file}: duplicate id ${item.id}`);
    }
    seen.add(item.id);
  }
}

if (COURSE_STRUCTURE.length !== 15) {
  issues.push(`course.ts: expected 15 lessons, got ${COURSE_STRUCTURE.length}`);
}

checkDuplicateIds(COURSE_STRUCTURE, 'course.ts');

for (const lesson of COURSE_STRUCTURE) {
  if (lesson.id < 1 || lesson.id > 15) {
    issues.push(`course.ts: invalid lesson id ${lesson.id}`);
  }
}

checkDuplicateIds(QUIZ_BANK, 'quiz-bank.ts');
checkDuplicateIds(WRITING_BANK, 'writing-bank.ts');

const readingPassages = Object.values(READING_BANK).flat();
const readingQuestions = readingPassages.flatMap((passage) => passage.questions);
checkDuplicateIds(readingPassages, 'reading-bank.ts passages');
checkDuplicateIds(readingQuestions, 'reading-bank.ts questions');

for (const key of Object.keys(READING_BANK)) {
  const lessonId = Number(key);

  if (!Number.isInteger(lessonId) || lessonId < 1 || lessonId > 15) {
    issues.push(`reading-bank.ts: invalid lesson key "${key}"`);
  }

  if (String(lessonId) !== key) {
    issues.push(`reading-bank.ts: non-canonical lesson key "${key}"`);
  }
}

const validLessonIds = new Set(COURSE_STRUCTURE.map((lesson) => lesson.id));
for (const q of QUIZ_BANK) {
  if (!validLessonIds.has(q.lessonId)) {
    issues.push(`quiz-bank.ts: question ${q.id} points to missing lesson ${q.lessonId}`);
  }
}

for (const prompt of WRITING_BANK) {
  if (!validLessonIds.has(prompt.lessonId)) {
    issues.push(`writing-bank.ts: prompt ${prompt.id} points to missing lesson ${prompt.lessonId}`);
  }
}

const courseIds = new Set(COURSE_STRUCTURE.map((lesson) => lesson.id));
for (let lessonId = 1; lessonId <= 15; lessonId += 1) {
  if (!courseIds.has(lessonId)) {
    issues.push(`course.ts: missing lesson ${lessonId}`);
  }
  if (!LESSONS_DATA[lessonId]) {
    issues.push(`lessons: missing content for lesson ${lessonId}`);
  }
}

if (issues.length > 0) {
  console.error(`${issues.length} content issue(s):`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exitCode = 1;
} else {
  const readingCount = readingPassages.length;
  console.log(
    `Content valid: ${COURSE_STRUCTURE.length} lessons, ${QUIZ_BANK.length} quiz questions, ` +
      `${readingCount} reading passages, ${WRITING_BANK.length} writing prompts.`,
  );
}
