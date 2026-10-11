import { useCallback, useEffect, useRef, useState } from 'react';
import { useProgressRepository } from '../../../app/providers/ProgressRepositoryProvider';
import type { LessonProgress } from '../../../domain/progress/progress.types';
import type { ReviewStatus } from '../../../data/schemas';
import type { VocabularyEntry } from '../../../domain/vocabulary/vocabulary.types';
import { planVocabularyBatch } from '../../../domain/vocabulary/session-planner';
import type {
  VocabularyMutation,
  VocabularySession,
} from '../../../domain/vocabulary/vocabulary-session';

export function useVocabularySession(
  lessonId: number,
  entries: VocabularyEntry[],
  requestedWord?: string,
) {
  const { repository, storageRevision } = useProgressRepository();
  const [session, setSession] = useState<VocabularySession | null>(null);
  const [progress, setProgress] = useState<LessonProgress | null>(null);
  const [reviews, setReviews] = useState<ReviewStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lock = useRef(false);
  const initial = useRef(entries);
  const mounted = useRef(true);
  const sequence = useRef(0);
  const refresh = useCallback(async () => {
    const ticket = ++sequence.current;
    try {
      const [stored, lesson, items] = await Promise.all([
        repository.getVocabularySession(lessonId),
        repository.getLessonProgress(lessonId),
        repository.getReviewItems(),
      ]);
      if (!mounted.current || ticket !== sequence.current) return;
      setSession(stored);
      setProgress(lesson);
      setReviews(items);
      setError(null);
    } catch {
      if (mounted.current) setError('Không tải được phiên từ vựng. Hãy thử kết nối lại bộ nhớ.');
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [repository, lessonId]);
  useEffect(() => {
    const sequenceRef = sequence;
    let active = true;
    mounted.current = true;
    const initialize = async () => {
      try {
        const [stored, lesson, items] = await Promise.all([
          repository.getVocabularySession(lessonId),
          repository.getLessonProgress(lessonId),
          repository.getReviewItems(),
        ]);
        if (!active) return;
        if (!stored || (requestedWord && !stored.itemIds.includes(requestedWord))) {
          const now = new Date().toISOString();
          await repository.startVocabularySession(
            {
              id: crypto.randomUUID(),
              lessonId,
              itemIds: requestedWord
                ? [requestedWord]
                : planVocabularyBatch(
                    initial.current,
                    10,
                    lesson?.steps?.vocabularyIds ?? [],
                    items,
                  ),
              batchSize: 10,
              cursor: 0,
              grades: {},
              startedAt: now,
              updatedAt: now,
            },
            stored?.id,
          );
        } else if (requestedWord && stored.itemIds[stored.cursor] !== requestedWord) {
          await repository.mutateVocabularySession({
            kind: 'move',
            cursor: stored.itemIds.indexOf(requestedWord),
            sessionId: stored.id,
            lessonId,
            occurredAt: new Date().toISOString(),
          });
        }
        if (active) await refresh();
      } catch {
        if (active) {
          setError('Không tải được phiên từ vựng. Hãy thử kết nối lại bộ nhớ.');
          setLoading(false);
        }
      }
    };
    void initialize();
    const focus = () => {
      if (!lock.current) void refresh();
    };
    window.addEventListener('focus', focus);
    const timer = setInterval(focus, 30_000);
    return () => {
      active = false;
      mounted.current = false;
      sequenceRef.current++;
      clearInterval(timer);
      window.removeEventListener('focus', focus);
    };
  }, [repository, lessonId, refresh, storageRevision, requestedWord]);

  async function run(action: () => Promise<VocabularySession>) {
    if (lock.current) return;
    lock.current = true;
    setSaving(true);
    setError(null);
    sequence.current++;
    try {
      const stored = await action();
      if (!mounted.current) return;
      setSession(stored);
      // A committed grade remains confirmed even if the following read fails.
      try {
        const [lesson, items] = await Promise.all([
          repository.getLessonProgress(lessonId),
          repository.getReviewItems(),
        ]);
        if (mounted.current) {
          setProgress(lesson);
          setReviews(items);
        }
      } catch {
        if (mounted.current)
          setError('Thao tác đã lưu; chưa tải lại được thống kê. Hãy thử tải lại phiên.');
      }
    } catch {
      if (mounted.current)
        setError(
          'Chưa lưu được thao tác hoặc phiên đã đổi ở tab khác. Thử lại hoặc tải lại phiên; dữ liệu đã lưu được giữ nguyên.',
        );
    } finally {
      lock.current = false;
      if (mounted.current) setSaving(false);
    }
  }
  function mutate(
    action:
      | Omit<Extract<VocabularyMutation, { kind: 'move' }>, 'sessionId' | 'lessonId' | 'occurredAt'>
      | Omit<
          Extract<VocabularyMutation, { kind: 'grade' }>,
          'sessionId' | 'lessonId' | 'occurredAt'
        >,
  ) {
    if (!session) return Promise.resolve();
    return run(() =>
      repository.mutateVocabularySession({
        ...action,
        sessionId: session.id,
        lessonId,
        occurredAt: new Date().toISOString(),
      }),
    );
  }
  function start(itemIds: string[], batchSize: 5 | 10 | 15) {
    if (!itemIds.length) return Promise.resolve();
    const now = new Date().toISOString();
    return run(() =>
      repository.startVocabularySession(
        {
          id: crypto.randomUUID(),
          lessonId,
          itemIds,
          batchSize,
          cursor: 0,
          grades: {},
          startedAt: now,
          updatedAt: now,
        },
        session?.id,
      ),
    );
  }
  return { session, progress, reviews, loading, saving, error, refresh, start, mutate };
}
