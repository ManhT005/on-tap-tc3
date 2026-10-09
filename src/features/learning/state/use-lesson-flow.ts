import { useEffect, useState } from 'react';
import {
  getLessonById,
  getLessonGrammar,
  getLessonQuiz,
} from '../../../domain/learning/lesson.service';
import { createReviewStatus, gradeReview } from '../../../domain/review/review-engine';
import { completePracticeSession } from '../../../domain/practice/complete-practice';
import { createPracticeSession } from '../../../domain/practice/practice-session';
import type { PracticeResult } from '../../../domain/practice/practice.types';
import type { RecallConfidence } from '../../../components/learning/Flashcard';
import { useProgressRepository } from '../../../app/providers/ProgressRepositoryProvider';

export function getVocabularyReviewId(lessonId: number, packIndex: number, itemIndex: number) {
  return `lesson-${lessonId}-vocabulary-${packIndex}-${itemIndex}`;
}

export function getStableVocabularyReviewId(lessonId: number, krWord: string) {
  return `lesson-${lessonId}-vocab-${encodeURIComponent(krWord)}`;
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function useLessonFlow(lessonId: number) {
  const { repository } = useProgressRepository();
  const lessonResult = getLessonById(lessonId);
  const grammarResult = getLessonGrammar(lessonId);
  const quizResult = getLessonQuiz(lessonId);
  const [startedAt] = useState(() => new Date().toISOString());
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [result, setResult] = useState<PracticeResult | null>(null);
  const [reviewedVocabulary, setReviewedVocabulary] = useState<Set<string>>(() => new Set());
  const [loading, setLoading] = useState(() => lessonResult.ok);
  const [error, setError] = useState<string | null>(null);

  const [session] = useState(() =>
    createPracticeSession({
      id: createId('lesson-session'),
      lessonId,
      mode: 'lesson',
      questionIds: quizResult.ok ? quizResult.data.map((question) => question.id) : [],
      startedAt,
    }),
  );

  useEffect(() => {
    let active = true;

    if (!lessonResult.ok) return;

    Promise.all([repository.getLessonProgress(lessonId), repository.getReviewItems()])
      .then(async ([progress, reviewItems]) => {
        if (!progress || progress.status !== 'COMPLETED') {
          await repository.saveLessonProgress({
            lessonId,
            status: 'IN_PROGRESS',
            completionPercent: progress?.completionPercent
              ? Math.max(progress.completionPercent, 25)
              : 25,
            startedAt: progress?.startedAt ?? startedAt,
            updatedAt: new Date().toISOString(),
          });
        }

        if (active) {
          setReviewedVocabulary(
            new Set(
              reviewItems
                .filter((item) => item.itemType === 'vocabulary')
                .map((item) => item.itemId),
            ),
          );
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
  }, [lessonId, lessonResult.ok, repository, startedAt]);

  async function advanceLessonProgress(targetPercent: number) {
    try {
      const current = await repository.getLessonProgress(lessonId);
      if (
        current &&
        current.status === 'IN_PROGRESS' &&
        (current.completionPercent ?? 0) < targetPercent
      ) {
        await repository.saveLessonProgress({
          ...current,
          completionPercent: targetPercent,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch {
      // Non-critical progress advancement
    }
  }

  async function markVocabularyForReview(itemId: string) {
    try {
      const existing = (await repository.getReviewItems()).find(
        (item) => item.itemType === 'vocabulary' && item.itemId === itemId,
      );
      if (!existing) {
        await repository.saveReviewItem(createReviewStatus(itemId, 'vocabulary', new Date()));
      }
      setReviewedVocabulary((current) => new Set(current).add(itemId));
      await advanceLessonProgress(50);
    } catch {
      setError('Không lưu được mục từ vựng cần ôn.');
    }
  }

  async function rateVocabulary(itemId: string, confidence: RecallConfidence) {
    try {
      const existing = (await repository.getReviewItems()).find(
        (item) => item.itemType === 'vocabulary' && item.itemId === itemId,
      );
      const now = new Date();
      const initial = existing ?? createReviewStatus(itemId, 'vocabulary', now);
      await repository.saveReviewItem(gradeReview(initial, true, confidence, now));
      setReviewedVocabulary((current) => new Set(current).add(itemId));
      await advanceLessonProgress(50);
    } catch {
      setError('Không lưu được mức độ ghi nhớ.');
    }
  }

  function selectAnswer(questionId: number, answerIndex: number) {
    setAnswers((current) => ({ ...current, [String(questionId)]: answerIndex }));
  }

  async function submitPractice() {
    if (!quizResult.ok || result) return;

    try {
      const completedAt = new Date().toISOString();
      const completed = await completePracticeSession(
        { ...session, answers },
        quizResult.data.map(({ id, correctIndex }) => ({ id, correctIndex })),
        repository,
        { resultId: createId('practice-result'), completedAt },
      );
      setResult(completed);
    } catch {
      setError('Không lưu được kết quả luyện tập. Vui lòng thử lại.');
    }
  }

  return {
    lessonResult,
    grammarResult,
    quizResult,
    answers,
    result,
    reviewedVocabulary,
    loading,
    error,
    markVocabularyForReview,
    rateVocabulary,
    selectAnswer,
    submitPractice,
  };
}
