import { COURSE_STRUCTURE } from '../src/data/course';
import { LESSONS_DATA } from '../src/data/lessons';
import { QUIZ_BANK } from '../src/data/quiz-bank';
import { READING_BANK } from '../src/data/reading-bank';
import { WRITING_BANK } from '../src/data/writing-bank';

const issues: string[] = [];
const warnings: string[] = [];

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

// Validate quiz questions
for (const q of QUIZ_BANK) {
  if (!validLessonIds.has(q.lessonId)) {
    issues.push(`quiz-bank.ts: question ${q.id} points to missing lesson ${q.lessonId}`);
  }
  if (!q.question?.trim()) {
    issues.push(`quiz-bank.ts: question ${q.id} has empty question text`);
  }
  if (!Array.isArray(q.options) || q.options.length < 2) {
    issues.push(`quiz-bank.ts: question ${q.id} must have at least 2 options`);
  } else {
    for (let i = 0; i < q.options.length; i += 1) {
      if (!q.options[i]?.trim()) {
        issues.push(`quiz-bank.ts: question ${q.id} option ${i} is empty`);
      }
    }
  }
  if (
    !Number.isInteger(q.correctIndex) ||
    q.correctIndex < 0 ||
    q.correctIndex >= q.options.length
  ) {
    issues.push(
      `quiz-bank.ts: question ${q.id} has invalid correctIndex ${q.correctIndex} (options count: ${q.options.length})`,
    );
  }
  if (!q.explanation?.trim()) {
    issues.push(`quiz-bank.ts: question ${q.id} has empty explanation`);
  }
}

// Validate reading passages & questions
for (const passage of readingPassages) {
  if (!passage.title?.trim()) {
    issues.push(`reading-bank.ts: passage ${passage.id} has empty title`);
  }
  if (!passage.koreanText?.trim()) {
    issues.push(`reading-bank.ts: passage ${passage.id} has empty koreanText`);
  }
  if (!passage.vietnameseTranslation?.trim()) {
    issues.push(`reading-bank.ts: passage ${passage.id} has empty vietnameseTranslation`);
  }
  for (const q of passage.questions) {
    if (!q.question?.trim()) {
      issues.push(
        `reading-bank.ts: question ${q.id} in passage ${passage.id} has empty question text`,
      );
    }
    if (!Array.isArray(q.options) || q.options.length < 2) {
      issues.push(`reading-bank.ts: question ${q.id} must have at least 2 options`);
    } else {
      for (let i = 0; i < q.options.length; i += 1) {
        if (!q.options[i]?.trim()) {
          issues.push(`reading-bank.ts: question ${q.id} option ${i} is empty`);
        }
      }
    }
    if (
      !Number.isInteger(q.correctIndex) ||
      q.correctIndex < 0 ||
      q.correctIndex >= q.options.length
    ) {
      issues.push(
        `reading-bank.ts: question ${q.id} has invalid correctIndex ${q.correctIndex} (options count: ${q.options.length})`,
      );
    }
    if (!q.evidence?.trim()) {
      issues.push(`reading-bank.ts: question ${q.id} has empty evidence`);
    }
  }
}

// Validate writing prompts
for (const prompt of WRITING_BANK) {
  if (!validLessonIds.has(prompt.lessonId)) {
    issues.push(`writing-bank.ts: prompt ${prompt.id} points to missing lesson ${prompt.lessonId}`);
  }
  if (!prompt.title?.trim()) {
    issues.push(`writing-bank.ts: prompt ${prompt.id} has empty title`);
  }
  if (!prompt.prompt?.trim()) {
    issues.push(`writing-bank.ts: prompt ${prompt.id} has empty prompt text`);
  }
  if (!prompt.modelAnswer?.trim()) {
    issues.push(`writing-bank.ts: prompt ${prompt.id} has empty modelAnswer`);
  }
  if (!prompt.explanation?.trim()) {
    issues.push(`writing-bank.ts: prompt ${prompt.id} has empty explanation`);
  }
  if (!Array.isArray(prompt.requiredKeywords) || prompt.requiredKeywords.length === 0) {
    issues.push(`writing-bank.ts: prompt ${prompt.id} has no requiredKeywords`);
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

// Coverage warnings (separate from fatal schema issues)
for (let lessonId = 1; lessonId <= 15; lessonId += 1) {
  const quizCount = QUIZ_BANK.filter((q) => q.lessonId === lessonId).length;
  const readingCount = (READING_BANK[lessonId as keyof typeof READING_BANK] ?? []).length;
  const writingCount = WRITING_BANK.filter((p) => p.lessonId === lessonId).length;

  if (quizCount === 0) {
    warnings.push(`Lesson ${lessonId}: 0 quiz questions (planned for Phase 3)`);
  }
  if (readingCount === 0) {
    warnings.push(`Lesson ${lessonId}: 0 reading passages (planned for Phase 3)`);
  }
  if (writingCount === 0) {
    warnings.push(`Lesson ${lessonId}: 0 writing prompts (planned for Phase 3)`);
  }
}

if (warnings.length > 0) {
  console.warn(`[Content Coverage Warnings - ${warnings.length} items]:`);
  for (const w of warnings) console.warn(`  ! ${w}`);
}

if (issues.length > 0) {
  console.error(`\n${issues.length} content validation error(s):`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exitCode = 1;
} else {
  const readingCount = readingPassages.length;
  console.log(
    `\nContent schema valid: ${COURSE_STRUCTURE.length} lessons, ${QUIZ_BANK.length} quiz questions, ` +
      `${readingCount} reading passages, ${WRITING_BANK.length} writing prompts.`,
  );
}
