import { useEffect, useRef, useState } from 'react';
import {
  getLessonById,
  getLessonGrammar,
  getLessonQuiz,
} from '../../../domain/learning/lesson.service';
import { completePracticeSession } from '../../../domain/practice/complete-practice';
import { createPracticeSession } from '../../../domain/practice/practice-session';
import type { PracticeResult } from '../../../domain/practice/practice.types';
import type { LessonProgress } from '../../../domain/progress/progress.types';
import type { ReviewCommand } from '../../../domain/review/review-command';
import type { RecallConfidence } from '../../../components/learning/Flashcard';
import { useProgressRepository } from '../../../app/providers/ProgressRepositoryProvider';
import { getLessonRequirements } from '../../../domain/progress/lesson-progress';

export function useLessonFlow(lessonId: number) {
  const { repository, storageRevision } = useProgressRepository();
  const lessonResult = getLessonById(lessonId);
  const grammarResult = getLessonGrammar(lessonId);
  const quizResult = getLessonQuiz(lessonId);
  const [startedAt] = useState(() => new Date().toISOString());
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [result, setResult] = useState<PracticeResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState<LessonProgress | null>(null);
  const [loading, setLoading] = useState(() => lessonResult.ok);
  const [error, setError] = useState<string | null>(null);
  const submitLock = useRef(false);
  const itemLocks = useRef(new Set<string>());
  const pendingEvents = useRef(new Map<string, ReviewCommand>());
  const [session] = useState(() =>
    createPracticeSession({
      id: crypto.randomUUID(),
      lessonId,
      mode: 'lesson',
      questionIds: quizResult.ok ? quizResult.data.map((question) => question.id) : [],
      startedAt,
    }),
  );

  useEffect(() => {
    if (!lessonResult.ok) return;
    let active = true;
    repository
      .applyLessonEvent({ lessonId, kind: 'opened', occurredAt: startedAt })
      .then((stored) => {
        if (active) {
          setProgress(stored);
          setError(null);
        }
      })
      .catch(() => {
        if (active) setError('Không tải được dữ liệu học. Vui lòng thử lại.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [lessonId, lessonResult.ok, repository, startedAt, storageRevision]);

  async function refreshProgress() {
    const stored = await repository.getLessonProgress(lessonId);
    setProgress(stored);
  }

  async function recordVocabulary(itemId: string, confidence?: RecallConfidence) {
    if (itemLocks.current.has(itemId)) return;
    itemLocks.current.add(itemId);
    setError(null);
    const now = new Date().toISOString();
    const recall =
      confidence !== undefined && getLessonRequirements(lessonId).recallIds.includes(itemId);
    const command = pendingEvents.current.get(itemId) ?? {
      eventId: crypto.randomUUID(),
      itemId,
      itemType: 'vocabulary' as const,
      correct: confidence === undefined ? false : confidence >= 3,
      confidence: confidence ?? 1,
      gradedAt: now,
      kind: confidence === undefined ? ('mark' as const) : ('grade' as const),
      lessonEvent: {
        lessonId,
        kind: recall ? ('recall' as const) : ('vocabulary' as const),
        itemId,
        occurredAt: now,
      },
    };
    pendingEvents.current.set(itemId, command);
    try {
      await repository.applyReview(command);
      await refreshProgress();
      pendingEvents.current.delete(itemId);
    } catch {
      setError('Không lưu được bước học. Hãy thử lại thao tác để lưu an toàn.');
    } finally {
      itemLocks.current.delete(itemId);
    }
  }

  async function markGrammarViewed(itemId: string) {
    setError(null);
    try {
      await repository.applyReview({
        eventId: crypto.randomUUID(),
        itemId,
        itemType: 'grammar',
        kind: 'mark',
        correct: false,
        confidence: 1,
        gradedAt: new Date().toISOString(),
        lessonEvent: {
          lessonId,
          kind: 'grammar',
          itemId,
          occurredAt: new Date().toISOString(),
        },
      });
      await refreshProgress();
    } catch {
      setError('Không lưu được bước ngữ pháp. Vui lòng thử lại.');
    }
  }

  function selectAnswer(questionId: number, answerIndex: number) {
    if (submitLock.current || result) return;
    setAnswers((current) => ({ ...current, [String(questionId)]: answerIndex }));
  }

  async function submitPractice() {
    if (!quizResult.ok || result || submitLock.current) return;
    submitLock.current = true;
    setSubmitting(true);
    setError(null);
    try {
      const completed = await completePracticeSession(
        { ...session, answers },
        quizResult.data,
        repository,
        { resultId: `lesson-result-${session.id}`, completedAt: new Date().toISOString() },
      );
      setResult(completed);
      try {
        await refreshProgress();
      } catch {
        setError(
          'Kết quả đã được lưu, nhưng chưa tải lại được tiến độ. Hãy thử kết nối lại bộ nhớ.',
        );
      }
    } catch {
      setError('Không lưu được kết quả luyện tập. Vui lòng thử lại.');
    } finally {
      submitLock.current = false;
      setSubmitting(false);
    }
  }

  return {
    lessonResult,
    grammarResult,
    quizResult,
    answers,
    result,
    progress,
    submitting,
    reviewedVocabulary: new Set(progress?.steps?.vocabularyIds ?? []),
    loading,
    error,
    markVocabularyForReview: (itemId: string) => recordVocabulary(itemId),
    rateVocabulary: (itemId: string, confidence: RecallConfidence) =>
      recordVocabulary(itemId, confidence),
    markGrammarViewed,
    selectAnswer,
    submitPractice,
  };
}
