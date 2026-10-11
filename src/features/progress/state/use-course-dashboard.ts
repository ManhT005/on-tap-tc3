import { useEffect, useState } from 'react';
import { getLessons } from '../../../domain/learning/course.service';
import type { CourseProgress, LessonProgress } from '../../../domain/progress/progress.types';
import { useProgressRepository } from '../../../app/providers/ProgressRepositoryProvider';
import { getReviewPrompt } from '../../../domain/review/review-content';

export type CourseDashboardData = {
  progress: CourseProgress;
  nextLessonId: number | null;
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
        progress = {
          ...progress,
          reviewsDue: reviewItems.filter(
            (item) => item.nextReviewAt <= now && getReviewPrompt(item) !== null,
          ).length,
        };
        const progressByLesson = new Map<number, LessonProgress | null>(progressEntries);
        const nextLesson =
          lessons.find((lesson) => progressByLesson.get(lesson.id)?.status === 'IN_PROGRESS') ??
          lessons.find((lesson) => progressByLesson.get(lesson.id)?.status !== 'COMPLETED');

        if (active) {
          setState({
            key: reloadKey,
            data: { progress, nextLessonId: nextLesson?.id ?? null },
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
