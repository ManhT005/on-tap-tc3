import { RouterProvider } from 'react-router-dom';
import { ProgressRepositoryProvider } from './providers/ProgressRepositoryProvider';
import { router } from './router';

export default function App() {
  return (
    <ProgressRepositoryProvider>
      <RouterProvider router={router} />
    </ProgressRepositoryProvider>
  );
}
