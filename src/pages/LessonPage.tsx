import { useParams } from 'react-router-dom';
import { LessonLearningFlow } from '../features/learning/components/LessonLearningFlow';

export function LessonPage() {
  const { lessonId: lessonIdParam } = useParams();
  const lessonId = Number(lessonIdParam);
  return <LessonLearningFlow key={lessonId} lessonId={lessonId} />;
}
