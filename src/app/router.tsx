import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from './AppShell';

function Placeholder({ title }: { title: string }) {
  return (
    <section className="page-placeholder">
      <h1>{title}</h1>
      <p>Màn hình này sẽ được triển khai ở phase tiếp theo.</p>
    </section>
  );
}

export const routes = [
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Placeholder title="Home" /> },
      { path: 'learn', element: <Placeholder title="Learn" /> },
      {
        path: 'learn/:lessonId',
        element: <Placeholder title="Lesson Detail" />,
      },
      { path: 'review', element: <Placeholder title="Review" /> },
      { path: 'practice', element: <Placeholder title="Practice" /> },
      { path: 'progress', element: <Placeholder title="Progress" /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
