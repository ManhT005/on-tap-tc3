/** One-time authoring utility. Committed IDs and legacy mapping are immutable. */
import ts from 'typescript';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { LESSONS_DATA } from '../src/data/lessons';

const mappingPath = 'src/data/legacy-review-ids.v1.json';
if (existsSync(mappingPath))
  throw new Error('Identity migration already exists; do not regenerate it.');
const aliases: Record<string, string> = {};
const ambiguous = new Set<string>();
for (let lessonId = 1; lessonId <= 15; lessonId++) {
  const path = `src/data/lessons/lesson-${String(lessonId).padStart(2, '0')}.ts`;
  const source = readFileSync(path, 'utf8');
  const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true);
  const edits: { position: number; text: string }[] = [];
  let packIndex = 0;
  let vocabularyIndex = 0;
  let grammarIndex = 0;
  const lesson = LESSONS_DATA[lessonId]!;
  function visit(node: ts.Node) {
    if (ts.isCallExpression(node) && node.expression.getText(file) === 'pack') {
      const tuples = node.arguments[2];
      if (!tuples || !ts.isArrayLiteralExpression(tuples))
        throw new Error(`Invalid pack in ${path}`);
      tuples.elements.forEach((tuple, itemIndex) => {
        if (!ts.isArrayLiteralExpression(tuple) || tuple.elements.length !== 3)
          throw new Error('Expected 3-field legacy tuple.');
        const id = `vocab-${String(lessonId).padStart(2, '0')}-${String(++vocabularyIndex).padStart(4, '0')}`;
        edits.push({ position: tuple.elements[2]!.end, text: `, '${id}'` });
        aliases[`lesson-${lessonId}-vocabulary-${packIndex}-${itemIndex}`] = id;
        const word = lesson.vocabulary[packIndex]!.items[itemIndex]!.kr;
        const alias = `lesson-${lessonId}-vocab-${encodeURIComponent(word)}`;
        if (aliases[alias]) ambiguous.add(alias);
        else aliases[alias] = id;
      });
      packIndex++;
    }
    if (ts.isPropertyAssignment(node) && node.name.getText(file) === 'structure') {
      const id = `grammar-${String(lessonId).padStart(2, '0')}-${String(grammarIndex + 1).padStart(3, '0')}`;
      edits.push({ position: node.getStart(file), text: `id: '${id}',\n    ` });
      aliases[`lesson-${lessonId}-grammar-${grammarIndex}`] = id;
      aliases[
        `lesson-${lessonId}-grammar-${encodeURIComponent(lesson.grammar[grammarIndex]!.structure)}`
      ] = id;
      grammarIndex++;
    }
    ts.forEachChild(node, visit);
  }
  visit(file);
  let updated = source;
  for (const edit of edits.sort((a, b) => b.position - a.position)) {
    updated = updated.slice(0, edit.position) + edit.text + updated.slice(edit.position);
  }
  writeFileSync(path, updated, 'utf8');
}
for (const alias of ambiguous) delete aliases[alias];
writeFileSync(mappingPath, JSON.stringify(aliases, null, 2) + '\n', 'utf8');
console.log(
  `Assigned explicit IDs; frozen ${Object.keys(aliases).length} legacy aliases; ${ambiguous.size} ambiguous word aliases retained for recovery.`,
);
