import { COURSE_STRUCTURE } from '../src/data/course';
import { LESSONS_DATA } from '../src/data/lessons';
import { QUIZ_BANK } from '../src/data/quiz-bank';
import { READING_BANK } from '../src/data/reading-bank';
import { WRITING_BANK } from '../src/data/writing-bank';
import { LISTENING_BANK } from '../src/data/listening-bank';
import { readFileSync } from 'node:fs';
import { z } from 'zod';

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
checkDuplicateIds(LISTENING_BANK, 'listening-bank.ts');
checkDuplicateIds(
  LISTENING_BANK.flatMap((passage) => passage.questions),
  'listening questions',
);

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
const contentIds = new Set<string>();
for (const [lessonId, lesson] of Object.entries(LESSONS_DATA)) {
  for (const item of [...lesson.vocabulary.flatMap((pack) => pack.items), ...lesson.grammar]) {
    if (!item.id) issues.push(`Lesson ${lessonId}: missing immutable item ID`);
    else if (contentIds.has(item.id))
      issues.push(`Lesson ${lessonId}: duplicate item ID ${item.id}`);
    else contentIds.add(item.id);
  }
}
for (const question of QUIZ_BANK) {
  for (const target of question.targetIds ?? [])
    if (!contentIds.has(target)) issues.push(`Quiz ${question.id}: unknown target ${target}`);
}

// Validate quiz questions
for (const q of QUIZ_BANK) {
  if (!validLessonIds.has(q.lessonId)) {
    issues.push(`quiz-bank.ts: question ${q.id} points to missing lesson ${q.lessonId}`);
  }
  if (!q.question?.trim()) {
    issues.push(`quiz-bank.ts: question ${q.id} has empty question text`);
  }
  if (!Array.isArray(q.options) || q.options.length !== 4) {
    issues.push(`quiz-bank.ts: question ${q.id} must have exactly 4 options`);
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
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      issues.push(`reading-bank.ts: question ${q.id} must have exactly 4 options`);
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

// Structural coverage is a blocking gate; language approval is separate.
for (let lessonId = 1; lessonId <= 15; lessonId += 1) {
  const quizCount = QUIZ_BANK.filter((q) => q.lessonId === lessonId).length;
  const readingCount = (READING_BANK[String(lessonId)] ?? []).length;
  const writingCount = WRITING_BANK.filter((p) => p.lessonId === lessonId).length;
  if (
    !process.argv.includes('--phase2') &&
    LISTENING_BANK.filter((passage) => passage.lessonId === lessonId).length < 2
  )
    issues.push(`Lesson ${lessonId}: fewer than 2 listening scripts`);

  if (quizCount < (process.argv.includes('--phase2') ? 8 : 12)) {
    issues.push(`Lesson ${lessonId}: insufficient quiz coverage (${quizCount})`);
  }
  if (readingCount < 2) {
    issues.push(`Lesson ${lessonId}: fewer than 2 reading passages`);
  }
  if (writingCount < 2) {
    issues.push(`Lesson ${lessonId}: fewer than 2 writing prompts`);
  }
}

if (warnings.length > 0) {
  console.warn(`[Content Coverage Warnings - ${warnings.length} items]:`);
  for (const w of warnings) console.warn(`  ! ${w}`);
}

if (process.argv.includes('--release')) {
  const registry = JSON.parse(
    readFileSync(new URL('../docs/content/CONTENT_APPROVALS.json', import.meta.url), 'utf8'),
  ) as { lessons?: unknown[] };
  const Approval = z.object({
    lessonId: z.number().int().min(1).max(15),
    status: z.literal('approved'),
    reviewer: z.string().trim().min(1),
    reviewedAt: z.string().datetime(),
    scopes: z.array(z.string()),
  });
  for (let lessonId = 1; lessonId <= 15; lessonId++) {
    const approval = (registry.lessons ?? [])
      .map((item) => Approval.safeParse(item))
      .find((item) => item.success && item.data.lessonId === lessonId);
    if (
      !approval?.success ||
      !['vocabulary', 'grammar', 'quiz', 'reading', 'writing', 'culture', 'listening'].every(
        (scope) => approval.data.scopes.includes(scope),
      )
    )
      issues.push(`RELEASE BLOCKED: lesson ${lessonId} needs human language/source approval`);
    const recorded = LISTENING_BANK.filter(
      (passage) =>
        passage.lessonId === lessonId &&
        passage.playback === 'recorded' &&
        passage.audio?.rightsApproved &&
        passage.reviewStatus === 'approved',
    );
    if (recorded.length < 2)
      issues.push(`RELEASE BLOCKED: lesson ${lessonId} needs two approved recorded audio assets`);
  }
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
