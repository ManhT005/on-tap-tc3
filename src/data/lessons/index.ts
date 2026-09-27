import type { LessonContent } from '../schemas';
import { lesson01 } from './lesson-01';
import { lesson02 } from './lesson-02';
import { lesson03 } from './lesson-03';
import { lesson04 } from './lesson-04';
import { lesson05 } from './lesson-05';
import { lesson06 } from './lesson-06';
import { lesson07 } from './lesson-07';
import { lesson08 } from './lesson-08';
import { lesson09 } from './lesson-09';
import { lesson10 } from './lesson-10';
import { lesson11 } from './lesson-11';
import { lesson12 } from './lesson-12';
import { lesson13 } from './lesson-13';
import { lesson14 } from './lesson-14';
import { lesson15 } from './lesson-15';

export const LESSONS_DATA: Record<number, LessonContent> = {
  1: lesson01,
  2: lesson02,
  3: lesson03,
  4: lesson04,
  5: lesson05,
  6: lesson06,
  7: lesson07,
  8: lesson08,
  9: lesson09,
  10: lesson10,
  11: lesson11,
  12: lesson12,
  13: lesson13,
  14: lesson14,
  15: lesson15,
};
