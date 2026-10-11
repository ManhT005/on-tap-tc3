import { useEffect, useState } from 'react';
import { getLessons } from '../../../domain/learning/course.service';
import type { CourseProgress, LessonProgress } from '../../../domain/progress/progress.types';
import { useProgressRepository } from '../../../app/providers/ProgressRepositoryProvider';
import { isReviewItemAvailable } from '../../../domain/learning/learning-manifest';

export type CourseDashboardData = {
  progress: CourseProgress;
  nextLessonId: number | null;
  reviewSummary: {
    newItems: number;
    learned: number;
    stableSchedule: number;
    nextReviewAt: string | null;
    orphanCount: number;
  };
};

export function useCourseDashboard(reloadKey = 0) {
  const { repository, storageRevision } = useProgressRepository();
  const [refreshTick, setRefreshTick] = useState(0);
  useEffect(() => {
    const refresh = () => setRefreshTick((value) => value + 1);
    const onVisibility = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    const timer = window.setInterval(refresh, 30_000);
    window.addEventListener('focus', refresh);
    window.addEventListener('tc3-progress-changed', refresh);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', refresh);
      window.removeEventListener('tc3-progress-changed', refresh);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);
  const [state, setState] = useState<{
    key: number;
    data: CourseDashboardData | null;
    loading: boolean;
    error: string | null;
  }>({
    key: reloadKey,
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;
    const lessons = getLessons();

    Promise.all([
      repository.getCourseProgress(),
      repository.getReviewItems(),
      Promise.all(
        lessons.map(
          async (lesson) => [lesson.id, await repository.getLessonProgress(lesson.id)] as const,
        ),
      ),
    ])
      .then(([progress, reviewItems, progressEntries]) => {
        const now = new Date().toISOString();
        const available = reviewItems.filter(isReviewItemAvailable);
        const stable = (item: (typeof available)[number]) =>
          item.repetitions > 0 && item.box === 5 && item.intervalDays === 30;
        const reviewSummary = {
          newItems: available.filter((item) => item.repetitions === 0).length,
          learned: available.filter((item) => item.repetitions > 0 && !stable(item)).length,
          stableSchedule: available.filter(stable).length,
          nextReviewAt:
            available
              .filter((item) => item.nextReviewAt > now)
              .map((item) => item.nextReviewAt)
              .sort()[0] ?? null,
          orphanCount: reviewItems.length - available.length,
        };
        progress = {
          ...progress,
          reviewsDue: reviewItems.filter(
            (item) => item.nextReviewAt <= now && isReviewItemAvailable(item),
          ).length,
        };
        const progressByLesson = new Map<number, LessonProgress | null>(progressEntries);
        const nextLesson =
          [...lessons]
            .filter((lesson) => progressByLesson.get(lesson.id)?.status === 'IN_PROGRESS')
            .sort((a, b) =>
              (progressByLesson.get(b.id)?.updatedAt ?? '').localeCompare(
                progressByLesson.get(a.id)?.updatedAt ?? '',
              ),
            )[0] ??
          lessons.find((lesson) => progressByLesson.get(lesson.id)?.status !== 'COMPLETED');

        if (active) {
          setState({
            key: reloadKey,
            data: { progress, nextLessonId: nextLesson?.id ?? null, reviewSummary },
            loading: false,
            error: null,
          });
        }
      })
      .catch(() => {
        if (active) {
          setState({
            key: reloadKey,
            data: null,
            loading: false,
            error: 'Không tải được tiến độ học tập.',
          });
        }
      });

    return () => {
      active = false;
    };
  }, [repository, reloadKey, storageRevision, refreshTick]);

  const isCurrent = state.key === reloadKey;
  return {
    ...(isCurrent ? state.data : null),
    loading: !isCurrent || state.loading,
    error: isCurrent ? state.error : null,
  };
}
