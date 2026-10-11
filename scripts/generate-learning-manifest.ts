import { readFileSync, writeFileSync } from 'node:fs';
import { LESSONS_DATA } from '../src/data/lessons';
import { QUIZ_BANK } from '../src/data/quiz-bank';
import { READING_BANK } from '../src/data/reading-bank';
import { LISTENING_BANK } from '../src/data/listening-bank';

const manifest = Object.fromEntries(
  Object.entries(LESSONS_DATA).map(([lessonId, lesson]) => [
    lessonId,
    {
      recallIds: lesson.vocabulary
        .flatMap((pack) => pack.items.slice(0, 2))
        .slice(0, 4)
        .map((item) => item.id),
      vocabularyIds: lesson.vocabulary.flatMap((pack) => pack.items.map((item) => item.id)),
      grammarIds: lesson.grammar.map((item) => item.id),
      questionIds: [
        ...QUIZ_BANK.filter((question) => question.lessonId === Number(lessonId)).map((question) =>
          String(question.id),
        ),
        ...(READING_BANK[lessonId] ?? []).flatMap((passage) =>
          passage.questions.map((question) => question.id),
        ),
        ...LISTENING_BANK.filter((passage) => passage.lessonId === Number(lessonId)).flatMap(
          (passage) => passage.questions.map((question) => question.id),
        ),
      ],
    },
  ]),
);
const path = 'src/data/learning-manifest.generated.json';
const output = JSON.stringify(manifest, null, 2) + '\n';
if (process.argv.includes('--check')) {
  if (readFileSync(path, 'utf8') !== output)
    throw new Error('Learning manifest is stale. Run npm run generate:manifest.');
} else writeFileSync(path, output, 'utf8');
