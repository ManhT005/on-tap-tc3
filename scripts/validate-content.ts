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

checkDuplicateIds(QUIZ_BANK, 'quiz-bank.ts');
checkDuplicateIds(WRITING_BANK, 'writing-bank.ts');

const readingPassages = Object.values(READING_BANK).flat();
const readingQuestions = readingPassages.flatMap((passage) => passage.questions);
checkDuplicateIds(readingPassages, 'reading-bank.ts passages');
checkDuplicateIds(readingQuestions, 'reading-bank.ts questions');

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
