import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { VocabularyLab } from '../features/vocabulary/components/VocabularyLab';
import { useProgressRepository } from '../app/providers/ProgressRepositoryProvider';

export function VocabularyPage() {
  const [params, setParams] = useSearchParams();
  const { repository } = useProgressRepository();
  const explicit = params.get('lesson');
  const parsed = Number(explicit);
  const valid = explicit !== null && Number.isInteger(parsed) && parsed >= 1 && parsed <= 15;
  const [ready, setReady] = useState(explicit !== null);
  useEffect(() => {
    if (explicit !== null) return;
    let active = true;
    void Promise.all(
      Array.from({ length: 15 }, (_, index) => repository.getLessonProgress(index + 1)),
    )
      .then((lessons) => {
        const recent = lessons
          .filter((lesson) => lesson?.status === 'IN_PROGRESS')
          .sort((a, b) => b!.updatedAt.localeCompare(a!.updatedAt))[0];
        if (active) {
          setParams(
            (previous) => {
              const next = new URLSearchParams(previous);
              next.set('lesson', String(recent?.lessonId ?? 1));
              return next;
            },
            { replace: true },
          );
          setReady(true);
        }
      })
      .catch(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, [explicit, repository, setParams]);
  if (!ready && explicit === null) return <p role="status">Đang chọn bài đang học...</p>;
  return (
    <>
      {explicit !== null && !valid ? (
        <p role="alert">Bài học không hợp lệ. Đang hiển thị Bài 01.</p>
      ) : null}
      <VocabularyLab key={valid ? parsed : 1} lessonId={valid ? parsed : 1} />
    </>
  );
}
