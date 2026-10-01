import { useEffect, useState } from 'react';
import { getLessons } from '../../../domain/learning/course.service';
import type { CourseProgress, LessonProgress } from '../../../domain/progress/progress.types';
import { useProgressRepository } from '../../../app/providers/ProgressRepositoryProvider';

export type CourseDashboardData = {
  progress: CourseProgress;
  nextLessonId: number | null;
};

export function useCourseDashboard() {
  const { repository } = useProgressRepository();
  const [data, setData] = useState<CourseDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        if (active) setData({ progress, nextLessonId: nextLesson?.id ?? null });
      })
      .catch(() => {
        if (active) setError('Không tải được tiến độ học tập.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [repository]);

  return { ...data, loading, error };
}
