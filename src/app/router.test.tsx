import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { routes } from './router';

const routeCases = [
  ['/', 'Home'],
  ['/learn', 'Learn'],
  ['/learn/3', 'Bài 03'],
  ['/learn/999', 'Không tìm thấy bài học'],
  ['/missing', 'Not Found'],
  ['/review', 'Review'],
  ['/practice', 'Practice'],
  ['/progress', 'Progress'],
] as const;

describe.each(routeCases)('route %s', (path, title) => {
  it(`renders the ${title} page`, async () => {
    const router = createMemoryRouter(routes, { initialEntries: [path] });

    render(<RouterProvider router={router} />);

    expect(await screen.findByRole('heading', { name: title })).toBeInTheDocument();
  });
});

it('navigates to a lesson and supports back navigation without a document reload', async () => {
  const user = userEvent.setup();
  const router = createMemoryRouter(routes, { initialEntries: ['/learn'] });

  render(<RouterProvider router={router} />);

  const firstLessonLink = screen.getAllByRole('link', { name: 'Mở bài học' })[0];
  if (!firstLessonLink) {
    throw new Error('Expected Learn to render a lesson link.');
  }

  await user.click(firstLessonLink);
  expect(router.state.location.pathname).toBe('/learn/1');
  expect(await screen.findByRole('heading', { name: 'Bài 01' })).toBeInTheDocument();

  await router.navigate(-1);
  expect(router.state.location.pathname).toBe('/learn');
  expect(await screen.findByRole('heading', { name: 'Learn' })).toBeInTheDocument();
});
