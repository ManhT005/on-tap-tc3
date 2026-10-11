import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { localVocabulary } from '../../../services/dictionary/local-vocabulary-provider';
import type { VocabularyEntry } from '../../../domain/vocabulary/vocabulary.types';
import { useProgressRepository } from '../../../app/providers/ProgressRepositoryProvider';
import { KoreanSpeechControls } from '../../../components/learning/KoreanSpeechControls';
import { Button } from '../../../components/ui/Button';

export function VocabularyDefinitionPopover({
  surface,
  candidates,
  sentence,
  lessonId,
  onClose,
}: {
  surface: string;
  candidates: VocabularyEntry[];
  sentence: string;
  lessonId: number;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const { repository } = useProgressRepository();
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState<VocabularyEntry[] | null>(null);
  const [saved, setSaved] = useState<string[]>([]);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const lock = useRef(false);
  useEffect(() => {
    const element = dialog.current;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    element?.showModal();
    return () => {
      element?.close();
      if (previous?.isConnected) previous.focus();
    };
  }, []);
  async function bookmark(entry: VocabularyEntry) {
    if (lock.current || saved.includes(entry.id)) return;
    lock.current = true;
    setSaving(entry.id);
    setError(null);
    try {
      await repository.applyReview({
        eventId: `vocabulary-bookmark:${entry.id}`,
        kind: 'mark',
        itemId: entry.id,
        itemType: 'vocabulary',
        confidence: 1,
        correct: false,
        gradedAt: new Date().toISOString(),
      });
      setSaved((previous) => [...previous, entry.id]);
    } catch {
      setError('Từ chưa được lưu để ôn. Hãy thử lại; dữ liệu cũ vẫn được giữ.');
    } finally {
      lock.current = false;
      setSaving(null);
    }
  }
  const results = search ?? candidates;
  return (
    <dialog
      ref={dialog}
      className="vocab-definition"
      aria-labelledby="vocab-definition-title"
      onCancel={onClose}
      onClose={onClose}
    >
      <header className="vocab-definition__header">
        <h2 id="vocab-definition-title">Tra từ trong học liệu</h2>
        <Button variant="ghost" onClick={onClose} aria-label="Đóng tra từ">
          Đóng
        </Button>
      </header>
      {surface ? (
        <>
          <h3 lang="ko">{surface}</h3>
          <KoreanSpeechControls text={surface} label="Đọc phần chọn" />
        </>
      ) : null}
      {!candidates.length && surface && search === null ? (
        <p role="status">
          Chưa khớp từ trong học liệu. Tiểu từ và đuôi chia cần dạng gốc hoặc alias đã kiểm duyệt;
          hãy tìm thủ công bên dưới.
        </p>
      ) : null}
      {candidates.length > 1 && search === null ? (
        <p role="note">
          Có nhiều nghĩa/mục từ. Các mục thuộc Bài {lessonId} được xếp trước; hãy chọn theo ngữ
          cảnh.
        </p>
      ) : null}
      {sentence ? (
        <div className="vocab-example">
          <p>Câu chứa từ:</p>
          <p lang="ko">{sentence}</p>
          <KoreanSpeechControls text={sentence} label="Đọc câu chứa từ" />
        </div>
      ) : null}
      <form
        className="vocab-lookup-form"
        onSubmit={(event) => {
          event.preventDefault();
          setSearch(localVocabulary.search(query, lessonId));
        }}
      >
        <label>
          Tìm nguyên dạng hoặc nghĩa
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ví dụ: 학기"
          />
        </label>
        <Button variant="secondary" type="submit" disabled={!query.trim()}>
          Tìm trong học liệu
        </Button>
      </form>
      {search !== null && !results.length ? (
        <p role="status">Chưa có kết quả trong 1.085 mục từ. Thử dạng gốc hoặc từ khóa khác.</p>
      ) : null}
      <div className="vocab-definitions">
        {results.map((entry) => (
          <article className="vocab-definition__entry" key={entry.id}>
            <h3 lang="ko">{entry.korean}</h3>
            <p className="vocab-meaning">{entry.vietnamese}</p>
            <p className="muted-copy">
              Bài {entry.lessonId}
              {entry.lessonId === lessonId ? ' · Cùng bài đang học' : ''} · {entry.category}
            </p>
            {entry.collocations.length ? (
              <p>
                Cụm liên quan: <span lang="ko">{entry.collocations.join(' · ')}</span>
              </p>
            ) : null}
            <KoreanSpeechControls text={entry.korean} label="Nghe từ gốc" />
            <div className="vocab-actions">
              <Button
                disabled={saving !== null || saved.includes(entry.id)}
                onClick={() => void bookmark(entry)}
              >
                {saved.includes(entry.id)
                  ? 'Đã lưu để ôn'
                  : saving === entry.id
                    ? 'Đang lưu...'
                    : 'Lưu để ôn'}
              </Button>
              <Link
                className="button button--secondary button--md"
                to={`/vocabulary?lesson=${entry.lessonId}&mode=flashcard&word=${entry.id}`}
                onClick={onClose}
              >
                Mở flashcard
              </Link>
            </div>
          </article>
        ))}
      </div>
      {error ? (
        <p role="alert" className="form-error">
          {error}
        </p>
      ) : null}
      <p className="muted-copy">
        Tra cứu nội bộ. Định nghĩa từ không phải bản dịch tự động của toàn câu.
      </p>
    </dialog>
  );
}
