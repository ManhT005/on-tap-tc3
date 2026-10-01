import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from './AppShell';

const HomePage = lazy(() =>
  import('../pages/HomePage').then((module) => ({ default: module.HomePage })),
);
const LearnPage = lazy(() =>
  import('../pages/LearnPage').then((module) => ({ default: module.LearnPage })),
);
const LessonPage = lazy(() =>
  import('../pages/LessonPage').then((module) => ({ default: module.LessonPage })),
);
const PracticePage = lazy(() =>
  import('../pages/PracticePage').then((module) => ({ default: module.PracticePage })),
);
const ProgressPage = lazy(() =>
  import('../pages/ProgressPage').then((module) => ({ default: module.ProgressPage })),
);
const ReviewPage = lazy(() =>
  import('../pages/ReviewPage').then((module) => ({ default: module.ReviewPage })),
);
import { NotFoundPage } from '../pages/NotFoundPage';

function RouteFallback() {
  return (
    <section className="page-panel" role="status" aria-label="Đang tải trang">
      <div className="skeleton" style={{ height: '48px' }} />
      <div className="skeleton" style={{ height: '180px' }} />
    </section>
  );
}

export const routes = [
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<RouteFallback />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'learn',
        element: (
          <Suspense fallback={<RouteFallback />}>
            <LearnPage />
          </Suspense>
        ),
      },
      {
        path: 'learn/:lessonId',
        element: (
          <Suspense fallback={<RouteFallback />}>
            <LessonPage />
          </Suspense>
        ),
      },
      {
        path: 'review',
        element: (
          <Suspense fallback={<RouteFallback />}>
            <ReviewPage />
          </Suspense>
        ),
      },
      {
        path: 'practice',
        element: (
          <Suspense fallback={<RouteFallback />}>
            <PracticePage />
          </Suspense>
        ),
      },
      {
        path: 'progress',
        element: (
          <Suspense fallback={<RouteFallback />}>
            <ProgressPage />
          </Suspense>
        ),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
