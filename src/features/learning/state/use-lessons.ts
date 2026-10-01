import { useEffect, useState } from 'react';
import { getLessons } from '../../../domain/learning/course.service';
import type { LessonProgress } from '../../../domain/progress/progress.types';
import { useProgressRepository } from '../../../app/providers/ProgressRepositoryProvider';

export function useLessons() {
  const { repository } = useProgressRepository();
  const [lessons] = useState(() => getLessons());
  const [progressByLesson, setProgressByLesson] = useState<Record<number, LessonProgress | null>>(
    {},
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    Promise.all(
      lessons.map(
        async (lesson) => [lesson.id, await repository.getLessonProgress(lesson.id)] as const,
      ),
    )
      .then((entries) => {
        if (active) setProgressByLesson(Object.fromEntries(entries));
      })
      .catch(() => {
        if (active) setError('Không tải được tiến độ bài học. Vui lòng thử lại.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [lessons, repository]);

  return { lessons, progressByLesson, loading, error };
}
