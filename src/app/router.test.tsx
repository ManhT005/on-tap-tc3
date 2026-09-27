import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { routes } from './router';

const routeCases = [
  ['/', 'Home'],
  ['/learn', 'Learn'],
  ['/learn/3', 'Lesson Detail'],
  ['/review', 'Review'],
  ['/practice', 'Practice'],
  ['/progress', 'Progress'],
] as const;

describe.each(routeCases)('route %s', (path, title) => {
  it(`renders the ${title} placeholder`, async () => {
    const router = createMemoryRouter(routes, { initialEntries: [path] });

    render(<RouterProvider router={router} />);

    expect(await screen.findByRole('heading', { name: title })).toBeInTheDocument();
  });
});
