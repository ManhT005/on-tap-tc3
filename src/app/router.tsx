import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from './AppShell';
import { HomePage } from '../pages/HomePage';
import { LearnPage } from '../pages/LearnPage';
import { LessonPage } from '../pages/LessonPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { PracticePage } from '../pages/PracticePage';
import { ProgressPage } from '../pages/ProgressPage';
import { ReviewPage } from '../pages/ReviewPage';

export const routes = [
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'learn', element: <LearnPage /> },
      { path: 'learn/:lessonId', element: <LessonPage /> },
      { path: 'review', element: <ReviewPage /> },
      { path: 'practice', element: <PracticePage /> },
      { path: 'progress', element: <ProgressPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
