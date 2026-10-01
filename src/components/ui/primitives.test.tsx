import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { COURSE_STRUCTURE } from '../../data/course';
import { EmptyState } from './EmptyState';
import { LessonCard } from './LessonCard';
import { PageHeader } from './PageHeader';
import { Skeleton } from './Skeleton';
import { StatTile } from './StatTile';
import { Toast } from './Toast';

describe('UI primitives', () => {
  it('renders a page header with its title and description', () => {
    render(<PageHeader eyebrow="Khóa học" title="Learn" description="Chọn một bài học" />);

    expect(screen.getByRole('heading', { name: 'Learn' })).toBeInTheDocument();
    expect(screen.getByText('Chọn một bài học')).toBeInTheDocument();
  });

  it('renders an empty state with the requested heading level', () => {
    render(
      <EmptyState
        title="Chưa có dữ liệu"
        description="Hãy quay lại sau."
        headingLevel="h1"
        role="alert"
      />,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Chưa có dữ liệu' })).toBeInTheDocument();
  });

  it('renders a stat tile value', () => {
    render(<StatTile label="Số bài học" value={15} />);

    expect(screen.getByText('Số bài học')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('renders a lesson card with a link to its detail route', () => {
    const firstLesson = COURSE_STRUCTURE[0];
    if (!firstLesson) {
      throw new Error('Expected the course structure to contain a lesson.');
    }

    render(
      <MemoryRouter>
        <LessonCard lesson={firstLesson} />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: firstLesson.koreanTitle })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Mở bài học' })).toHaveAttribute('href', '/learn/1');
  });

  it('keeps decorative skeletons out of the accessibility tree', () => {
    const { container } = render(<Skeleton width="50%" />);

    expect(container.querySelector('.skeleton')).toHaveAttribute('aria-hidden', 'true');
  });

  it('announces errors assertively', () => {
    render(<Toast tone="error">Không thể lưu</Toast>);

    expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'assertive');
  });
});
