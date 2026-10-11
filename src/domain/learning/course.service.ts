import { COURSE_STRUCTURE } from '../../data/course';
import type { LearningLessonSummary } from './learning.types';

export function getLessons(): LearningLessonSummary[] {
  return COURSE_STRUCTURE;
}
