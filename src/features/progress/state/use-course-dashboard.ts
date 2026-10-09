import { useEffect, useState } from 'react';
import { getLessons } from '../../../domain/learning/course.service';
import type { CourseProgress, LessonProgress } from '../../../domain/progress/progress.types';
import { useProgressRepository } from '../../../app/providers/ProgressRepositoryProvider';

export type CourseDashboardData = {
  progress: CourseProgress;
  nextLessonId: number | null;
};

export function useCourseDashboard(reloadKey = 0) {
  const { repository } = useProgressRepository();
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
      Promise.all(
        lessons.map(
          async (lesson) => [lesson.id, await repository.getLessonProgress(lesson.id)] as const,
        ),
      ),
    ])
      .then(([progress, progressEntries]) => {
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
  }, [repository, reloadKey]);

  const isCurrent = state.key === reloadKey;
  return {
    ...(isCurrent ? state.data : null),
    loading: !isCurrent || state.loading,
    error: isCurrent ? state.error : null,
  };
}
