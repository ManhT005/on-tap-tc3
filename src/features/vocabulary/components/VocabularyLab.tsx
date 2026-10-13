import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { COURSE_STRUCTURE } from '../../../data/course';
import { adaptVocabulary } from '../../../domain/vocabulary/vocabulary.adapter';
import { VOCABULARY_ENRICHMENT } from '../../../data/vocabulary-enrichment';
import { filterVocabulary, planVocabularyBatch } from '../../../domain/vocabulary/session-planner';
import type { VocabularyFilter } from '../../../domain/vocabulary/vocabulary.types';
import { useVocabularySession } from '../state/use-vocabulary-session';
import { VocabularyFlashcard } from './VocabularyFlashcard';
import { VocabularyCatalog } from './VocabularyCatalog';
import { Button } from '../../../components/ui/Button';
import { PageHeader } from '../../../components/ui/PageHeader';
import { getLessonReading } from '../../../domain/learning/lesson.service';
import { ContextualVocabulary } from './ContextualVocabulary';
import { KoreanSpeechControls } from '../../../components/learning/KoreanSpeechControls';

const entries = adaptVocabulary(VOCABULARY_ENRICHMENT);
const modes = [
  { id: 'flashcard', label: 'Flashcard' },
  { id: 'list', label: 'Danh sách' },
  { id: 'recall', label: 'Nhớ nghĩa' },
  { id: 'context', label: 'Trong ngữ cảnh' },
];
const confidenceLabels = ['Không nhớ', 'Khó nhớ', 'Nhớ được', 'Rất chắc'];

export function VocabularyLab({ lessonId }: { lessonId: number }) {
  const [params, setParams] = useSearchParams();
  const mode = modes.some((item) => item.id === params.get('mode'))
    ? params.get('mode')!
    : 'flashcard';
  const lessonEntries = entries.filter((entry) => entry.lessonId === lessonId);
  const wordId = params.get('word');
  const requestedWord =
    wordId && lessonEntries.some((entry) => entry.id === wordId) ? wordId : undefined;
  const state = useVocabularySession(lessonId, lessonEntries, requestedWord);
  const [batchSize, setBatchSize] = useState<5 | 10 | 15>(10);
  const [filter, setFilter] = useState<VocabularyFilter>('all');
  const [query, setQuery] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [guess, setGuess] = useState<string | null>(null);
  const [viewSessionId, setViewSessionId] = useState<string | null>(null);
  const card = useRef<HTMLDivElement>(null);
  const lab = useRef<HTMLElement>(null);
  const controls = useRef<HTMLDivElement>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const session = state.session;
  const entry = session
    ? entries.find((item) => item.id === session.itemIds[session.cursor])
    : undefined;
  const studied = state.progress?.steps?.vocabularyIds ?? [];
  const now = new Date().toISOString();
  const reading = getLessonReading(lessonId);
  const filtered = filterVocabulary(entries, {
    lessonId,
    filter,
    query,
    studied,
    reviews: state.reviews,
    now,
  });
  const done = session ? Object.keys(session.grades).length : 0;
  const complete = !!session && done === session.itemIds.length;
  const hardIds = session
    ? Object.entries(session.grades)
        .filter(([, grade]) => grade <= 2)
        .map(([id]) => id)
    : [];
  const currentCardKey = `${entry?.id}:${session?.id}:${mode}`;
  const [cardKey, setCardKey] = useState(currentCardKey);
  if (cardKey !== currentCardKey) {
    setCardKey(currentCardKey);
    setRevealed(false);
    setGuess(null);
  }
  const previousCard = useRef(currentCardKey);
  useEffect(() => {
    const changed = previousCard.current !== currentCardKey;
    previousCard.current = currentCardKey;
    if (
      changed &&
      window.matchMedia?.('(max-width: 680px)').matches &&
      card.current &&
      card.current.getBoundingClientRect().top < 0
    ) {
      card.current.scrollIntoView({ block: 'start', behavior: 'auto' });
    }
  }, [currentCardKey]);
  const hasEntry = !!entry;
  // Reserve exactly the dock's height, including safe-area and enlarged text.
  useEffect(() => {
    const element = controls.current;
    const root = lab.current;
    if (!element || !root) return;
    const measure = () =>
      root.style.setProperty('--vocab-dock-height', `${element.offsetHeight}px`);
    measure();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    observer?.observe(element);
    window.addEventListener('resize', measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measure);
      root.style.removeProperty('--vocab-dock-height');
    };
  }, [mode, hasEntry, complete, viewSessionId, requestedWord]);

  function changeMode(next: string) {
    const nextParams = new URLSearchParams(params);
    nextParams.set('mode', next);
    setParams(nextParams, { replace: true });
  }
  function grade(confidence: 1 | 2 | 3 | 4) {
    if (!entry || !revealed || state.saving || session?.grades[entry.id]) return;
    void state.mutate({ kind: 'grade', itemId: entry.id, confidence });
  }
  function move(delta: number) {
    if (!session || state.saving) return;
    const cursor = Math.max(0, Math.min(session.itemIds.length - 1, session.cursor + delta));
    if (cursor !== session.cursor) void state.mutate({ kind: 'move', cursor });
  }
  function keyboard(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || state.saving) return;
    const target = event.target as HTMLElement;
    if (target.closest('input,select,textarea,[contenteditable="true"]')) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      move(event.key === 'ArrowLeft' ? -1 : 1);
    } else if (event.code === 'Space' && !target.closest('button,a')) {
      event.preventDefault();
      setRevealed((value) => !value);
    } else if (['1', '2', '3', '4'].includes(event.key) && mode === 'flashcard' && revealed) {
      event.preventDefault();
      grade(Number(event.key) as 1 | 2 | 3 | 4);
    }
  }
  async function openWord(id: string) {
    const existing = session?.itemIds.indexOf(id) ?? -1;
    if (existing >= 0) await state.mutate({ kind: 'move', cursor: existing });
    else await state.start([id], 5);
    const next = new URLSearchParams(params);
    next.set('mode', 'flashcard');
    next.set('word', id);
    setParams(next, { replace: true });
  }
  function startBatch(ids: string[], size: 5 | 10 | 15) {
    const next = new URLSearchParams(params);
    next.delete('word');
    setParams(next, { replace: true });
    setFiltersOpen(false);
    return state.start(ids, size);
  }
  const options = entry
    ? [
        entry.vietnamese,
        ...lessonEntries
          .filter((item) => item.id !== entry.id && item.vietnamese !== entry.vietnamese)
          .map((item) => item.vietnamese)
          .filter((value, index, array) => array.indexOf(value) === index)
          .slice(0, 3),
      ].sort((a, b) => a.localeCompare(b, 'vi'))
    : [];

  return (
    <section
      ref={lab}
      className={`page-panel vocabulary-lab${filtersOpen ? ' vocabulary-lab--configuring' : ''}`}
    >
      <PageHeader
        eyebrow={`Learn / Bài ${String(lessonId).padStart(2, '0')} / Vocabulary Lab`}
        title={
          <>
            <span className="vocab-desktop-title">Học từ theo cách dễ nhớ hơn</span>
            <span className="vocab-mobile-title">
              Từ vựng · Bài {String(lessonId).padStart(2, '0')}
            </span>
          </>
        }
        description="Một lượt 10 từ. Tự nhớ nghĩa, nghe phát âm và ôn lại đúng lúc."
        action={
          <Link className="button button--secondary button--md" to={`/learn/${lessonId}`}>
            Về bài học
          </Link>
        }
      />
      <div className="vocab-mobile-toolbar">
        <Button
          className="vocab-mobile-toggle"
          variant="secondary"
          aria-expanded={filtersOpen}
          aria-controls="vocab-filters"
          onClick={() => setFiltersOpen((open) => !open)}
        >
          {filtersOpen ? 'Đóng bộ lọc' : 'Bộ học / Tìm từ'}
        </Button>
        <label className="vocab-mobile-mode" htmlFor="vocab-mobile-mode">
          <span>Chế độ học</span>
          <select
            id="vocab-mobile-mode"
            value={mode}
            disabled={state.saving}
            onChange={(event) => changeMode(event.target.value)}
          >
            {modes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div id="vocab-filters" className={`vocab-filters${filtersOpen ? ' is-open' : ''}`}>
        <label>
          Bài học
          <select
            value={lessonId}
            disabled={state.saving}
            onChange={(event) => {
              const next = new URLSearchParams(params);
              next.set('lesson', event.target.value);
              next.delete('word');
              setParams(next);
            }}
          >
            {COURSE_STRUCTURE.map((lesson) => (
              <option value={lesson.id} key={lesson.id}>
                Bài {String(lesson.id).padStart(2, '0')} · {lesson.koreanTitle}
              </option>
            ))}
          </select>
        </label>
        <label>
          Số từ mỗi lượt
          <select
            value={batchSize}
            disabled={state.saving}
            onChange={(event) => setBatchSize(Number(event.target.value) as 5 | 10 | 15)}
          >
            {[5, 10, 15].map((size) => (
              <option key={size} value={size}>
                {size} từ / lượt
              </option>
            ))}
          </select>
        </label>
        <label>
          Chọn bộ
          <select
            value={filter}
            disabled={state.saving}
            onChange={(event) => setFilter(event.target.value as VocabularyFilter)}
          >
            <option value="all">Tất cả</option>
            <option value="basic">Cơ bản</option>
            <option value="new-word">Từ mới trong bài</option>
            <option value="unseen">Chưa học</option>
            <option value="listening">Từ bài nghe</option>
            <option value="review">Từ cần ôn</option>
          </select>
        </label>
        <label>
          Tìm từ
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tiếng Hàn hoặc tiếng Việt"
          />
        </label>
        <Button
          variant="secondary"
          disabled={state.saving || state.loading || !filtered.length}
          onClick={() =>
            void startBatch(
              planVocabularyBatch(filtered, batchSize, studied, state.reviews),
              batchSize,
            )
          }
        >
          Bắt đầu bộ đã chọn
        </Button>
      </div>
      <div className="vocab-progress" role="region" aria-label="Tiến độ từ vựng">
        <span>
          Đã học {studied.length}/{lessonEntries.length} từ của bài
        </span>
        <span aria-live="polite" aria-atomic="true">
          Phiên: {done}/{session?.itemIds.length ?? 0} từ
        </span>
        <progress aria-label="Tiến độ phiên" value={done} max={session?.itemIds.length ?? 10} />
      </div>
      {state.error ? (
        <div role="alert" className="form-error">
          {state.error}
          <Button variant="secondary" disabled={state.saving} onClick={() => void state.refresh()}>
            Tải lại phiên
          </Button>
        </div>
      ) : null}
      {state.loading ? <p role="status">Đang tải phiên từ vựng...</p> : null}
      <div className="vocab-layout">
        <nav className="vocab-modes" aria-label="Chế độ từ vựng">
          {modes.map((item) => (
            <Button
              variant={mode === item.id ? 'primary' : 'ghost'}
              key={item.id}
              disabled={state.saving}
              aria-pressed={mode === item.id}
              onClick={() => changeMode(item.id)}
            >
              {item.label}
            </Button>
          ))}
          <p className="muted-copy">
            Học ít mỗi lượt. Từ khó sẽ được ưu tiên khi chọn bộ tiếp theo.
          </p>
          <Link className="button button--secondary button--md" to="/review">
            Mở lịch ôn SRS
          </Link>
        </nav>
        <section className="vocab-main card" aria-label="Khu học từ">
          <h2>{modes.find((item) => item.id === mode)?.label}</h2>
          {mode === 'context' ? (
            <>
              <p>
                Đọc học liệu của bài và tra nguyên dạng từ. Câu ví dụ trên flashcard chỉ xuất hiện
                khi được kiểm duyệt.
              </p>
              {reading.ok && reading.data[0] ? (
                <ContextualVocabulary
                  key={lessonId}
                  text={reading.data[0].koreanText}
                  lessonId={lessonId}
                  defaultEnabled
                />
              ) : (
                <p>Chưa có đoạn đọc.</p>
              )}
            </>
          ) : mode === 'list' ? (
            <VocabularyCatalog
              key={`${query}:${filter}`}
              entries={filtered}
              studied={studied}
              disabled={state.saving}
              onOpen={(id) => void openWord(id)}
            />
          ) : complete && viewSessionId !== session?.id && !requestedWord ? (
            <div className="vocab-summary" role="status">
              <h3>Đã hoàn thành lượt học</h3>
              <p>
                Đã đánh giá {done} từ · Không nhớ/khó nhớ: {hardIds.length} · Nhớ được/rất chắc:{' '}
                {done - hardIds.length}
              </p>
              <div className="vocab-actions">
                <Button variant="secondary" onClick={() => setViewSessionId(session!.id)}>
                  Xem lại các từ trong phiên
                </Button>
                <Button
                  disabled={state.saving || !hardIds.length}
                  onClick={() => void startBatch(hardIds, session!.batchSize)}
                >
                  Ôn lại từ khó
                </Button>
                <Button
                  variant="secondary"
                  disabled={
                    state.saving ||
                    !planVocabularyBatch(
                      filtered,
                      batchSize,
                      studied,
                      state.reviews,
                      session!.itemIds,
                    ).length
                  }
                  onClick={() =>
                    void startBatch(
                      planVocabularyBatch(
                        filtered,
                        batchSize,
                        studied,
                        state.reviews,
                        session!.itemIds,
                      ),
                      batchSize,
                    )
                  }
                >
                  Tiếp tục batch
                </Button>
              </div>
            </div>
          ) : entry && session ? (
            <div ref={card} tabIndex={0} onKeyDown={keyboard} aria-label="Phím tắt thẻ từ vựng">
              <p className="vocab-card-position muted-copy" aria-live="polite" aria-atomic="true">
                Thẻ {session.cursor + 1}/{session.itemIds.length} ·{' '}
                {session.grades[entry.id] ? 'Đã đánh giá, chỉ xem lại' : 'Chưa đánh giá'}
              </p>
              {mode === 'recall' ? (
                <>
                  <h3 className="vocab-hangul" lang="ko">
                    {entry.korean}
                  </h3>
                  <KoreanSpeechControls key={entry.id} text={entry.korean} compact />
                  <p>Chọn nghĩa đúng. Kết quả ghi vào SRS, không tính vào điểm bài thi.</p>
                  <div className="vocab-choices">
                    {options.map((option) => (
                      <Button
                        key={option}
                        variant="secondary"
                        disabled={state.saving || !!session.grades[entry.id] || guess !== null}
                        onClick={() => {
                          setGuess(option);
                          setRevealed(true);
                        }}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                  {guess ? (
                    <p role="status">
                      {guess === entry.vietnamese ? 'Đúng nghĩa.' : `Đáp án: ${entry.vietnamese}`}
                    </p>
                  ) : null}
                </>
              ) : (
                <VocabularyFlashcard entry={entry} revealed={revealed} />
              )}
              <div ref={controls} className="vocab-study-controls" aria-label="Thao tác học từ">
                {mode === 'recall' ? (
                  guess && !session.grades[entry.id] ? (
                    <Button
                      disabled={state.saving}
                      onClick={() =>
                        void state.mutate({
                          kind: 'grade',
                          itemId: entry.id,
                          confidence: guess === entry.vietnamese ? 3 : 1,
                        })
                      }
                    >
                      Lưu và tiếp tục
                    </Button>
                  ) : null
                ) : (
                  <>
                    <Button
                      className="vocab-reveal"
                      variant={revealed ? 'ghost' : 'primary'}
                      disabled={state.saving}
                      onClick={() => setRevealed((value) => !value)}
                      aria-expanded={revealed}
                    >
                      {revealed ? 'Ẩn nghĩa' : 'Hiện nghĩa'}
                    </Button>
                    {revealed ? (
                      <div className="vocab-grades" role="group" aria-label="Tự đánh giá từ vựng">
                        {confidenceLabels.map((label, index) => (
                          <Button
                            key={label}
                            className={`vocab-grade vocab-grade--${index + 1}`}
                            variant="secondary"
                            disabled={state.saving || !!session.grades[entry.id]}
                            onClick={() => grade((index + 1) as 1 | 2 | 3 | 4)}
                          >
                            {index + 1} · {label}
                          </Button>
                        ))}
                      </div>
                    ) : null}
                  </>
                )}
                <div className="vocab-actions vocab-navigation">
                  <Button
                    variant="secondary"
                    disabled={state.saving || session.cursor === 0}
                    onClick={() => move(-1)}
                  >
                    Từ trước
                  </Button>
                  <span className="vocab-navigation-position">
                    {session.cursor + 1}/{session.itemIds.length}
                  </span>
                  <Button
                    variant="secondary"
                    disabled={state.saving || session.cursor === session.itemIds.length - 1}
                    onClick={() => move(1)}
                  >
                    Từ tiếp
                  </Button>
                </div>
                <p className="vocab-touch-hint muted-copy">
                  {state.saving ? 'Đang lưu…' : 'Đánh giá để lưu và tự chuyển từ tiếp theo.'}
                </p>
              </div>
              <p className="vocab-keyboard-hint muted-copy">
                Tab vào thẻ: Space lật nghĩa, ←/→ xem từ, 1–4 đánh giá sau khi lật. Xem từ không ghi
                tiến độ.
              </p>
            </div>
          ) : (
            <p>Phiên chưa tải được. Dùng “Tải lại phiên” hoặc kết nối lại bộ nhớ.</p>
          )}
        </section>
        <Button
          className="vocab-mobile-toggle"
          variant="ghost"
          aria-expanded={statsOpen}
          aria-controls="vocab-stats"
          onClick={() => setStatsOpen((open) => !open)}
        >
          {statsOpen ? 'Ẩn thống kê' : 'Xem hành trình ghi nhớ'}
        </Button>
        <aside id="vocab-stats" className={`vocab-rail card${statsOpen ? ' is-open' : ''}`}>
          <h2>Hành trình ghi nhớ</h2>
          <dl>
            <dt>Từ đến hạn ôn trong bài</dt>
            <dd>
              {
                state.reviews.filter(
                  (item) =>
                    item.itemType === 'vocabulary' &&
                    item.nextReviewAt <= now &&
                    lessonEntries.some((candidate) => candidate.id === item.itemId),
                ).length
              }{' '}
              từ
            </dd>
            <dt>Đã đánh giá phiên này</dt>
            <dd>{done} từ</dd>
            <dt>Không nhớ / Khó nhớ</dt>
            <dd>{hardIds.length} từ</dd>
            <dt>Nhớ được / Rất chắc</dt>
            <dd>{done - hardIds.length} từ</dd>
          </dl>
          <p>Tự nhớ → lật nghĩa → nghe và đọc to → chọn mức độ nhớ.</p>
          <p className="muted-copy">
            Tự đánh giá phản ánh thao tác học, không chứng nhận đã thuộc từ. Ví dụ và giọng đọc cần
            kiểm duyệt trước phát hành chính thức.
          </p>
        </aside>
      </div>
    </section>
  );
}
