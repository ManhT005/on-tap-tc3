import { useState } from 'react';
import type { VocabularyEntry } from '../../../domain/vocabulary/vocabulary.types';
import { Button } from '../../../components/ui/Button';

export function VocabularyCatalog({
  entries,
  studied,
  onOpen,
  disabled,
}: {
  entries: VocabularyEntry[];
  studied: string[];
  onOpen: (id: string) => void;
  disabled: boolean;
}) {
  const [page, setPage] = useState(0);
  const last = Math.max(0, Math.ceil(entries.length / 20) - 1);
  const current = Math.min(page, last);
  return (
    <>
      <p>
        {entries.length} từ khớp · Trang {current + 1}/{last + 1}
      </p>
      <div className="vocab-catalog">
        {entries.slice(current * 20, current * 20 + 20).map((entry) => (
          <button
            key={entry.id}
            disabled={disabled}
            className="vocab-catalog__item"
            onClick={() => onOpen(entry.id)}
          >
            <strong lang="ko">{entry.korean}</strong>
            <span>{entry.vietnamese}</span>
            <small>
              {studied.includes(entry.id) ? 'Đã thao tác học' : 'Chưa học'} · {entry.category}
            </small>
          </button>
        ))}
      </div>
      {!entries.length ? <p role="status">Không tìm thấy từ trong bộ lọc này.</p> : null}
      <div className="vocab-actions">
        <Button variant="secondary" disabled={current === 0} onClick={() => setPage(current - 1)}>
          Trang trước
        </Button>
        <Button variant="secondary" disabled={current >= last} onClick={() => setPage(current + 1)}>
          Trang sau
        </Button>
      </div>
    </>
  );
}
