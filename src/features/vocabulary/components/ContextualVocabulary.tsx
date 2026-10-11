import { Fragment, useMemo, useRef, useState } from 'react';
import { matchContext, type ContextSpan } from '../../../domain/vocabulary/contextual-matcher';
import { localVocabulary } from '../../../services/dictionary/local-vocabulary-provider';
import { VocabularyDefinitionPopover } from './VocabularyDefinitionPopover';
import { Button } from '../../../components/ui/Button';

function containingSentence(text: string, start: number, end: number) {
  const before = text.slice(0, start);
  const boundary =
    Math.max(
      before.lastIndexOf('.'),
      before.lastIndexOf('?'),
      before.lastIndexOf('!'),
      before.lastIndexOf('\n'),
    ) + 1;
  const after = text.slice(end).search(/[.!?\n]/);
  return text.slice(boundary, after === -1 ? text.length : end + after + 1).trim();
}
export function ContextualVocabulary({
  text,
  lessonId,
  defaultEnabled = false,
}: {
  text: string;
  lessonId: number;
  defaultEnabled?: boolean;
}) {
  const [enabled, setEnabled] = useState(defaultEnabled);
  const [selected, setSelected] = useState<ContextSpan | null>(null);
  const [selection, setSelection] = useState('');
  const container = useRef<HTMLParagraphElement>(null);
  const spans = useMemo(() => matchContext(text, localVocabulary, lessonId), [text, lessonId]);
  const pieces: React.ReactNode[] = [];
  let cursor = 0;
  for (const span of spans) {
    pieces.push(<Fragment key={`text-${span.start}`}>{text.slice(cursor, span.start)}</Fragment>);
    pieces.push(
      <button
        className="context-word"
        key={span.start}
        type="button"
        title="Tra nghĩa trong học liệu"
        aria-label={`Tra từ ${span.text}`}
        onClick={() => setSelected(span)}
      >
        {span.text}
      </button>,
    );
    cursor = span.end;
  }
  pieces.push(<Fragment key="tail">{text.slice(cursor)}</Fragment>);
  return (
    <div className="contextual-vocabulary">
      <div className="vocab-actions">
        <Button
          variant="secondary"
          aria-pressed={enabled}
          onClick={() => setEnabled((value) => !value)}
        >
          {enabled ? 'Tắt tra từ' : 'Bật tra từ'}
        </Button>
        <Button
          variant="ghost"
          onClick={() =>
            setSelected({
              text: selection,
              start: -1,
              end: -1,
              candidates: localVocabulary.lookup(selection, lessonId),
            })
          }
        >
          {selection ? 'Tra phần đang chọn' : 'Tra từ thủ công'}
        </Button>
      </div>
      <p
        ref={container}
        className="reading-passage__text preserve-lines"
        lang="ko"
        onMouseUp={() => {
          const value = window.getSelection();
          if (
            value?.rangeCount &&
            container.current?.contains(value.getRangeAt(0).commonAncestorContainer)
          )
            setSelection(value.toString().trim().slice(0, 120));
        }}
      >
        {enabled ? pieces : text}
      </p>
      {enabled ? (
        <p className="muted-copy">
          Nhấn từ gạch chân để tra. Dạng chưa khớp: chọn văn bản hoặc tìm thủ công; không tự đoán
          nghĩa.
        </p>
      ) : null}
      {selected ? (
        <VocabularyDefinitionPopover
          surface={selected.text}
          candidates={selected.candidates}
          lessonId={lessonId}
          sentence={
            selected.start >= 0 ? containingSentence(text, selected.start, selected.end) : ''
          }
          onClose={() => setSelected(null)}
        />
      ) : null}
    </div>
  );
}
