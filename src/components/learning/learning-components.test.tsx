import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { getLessonGrammar, getLessonQuiz } from '../../domain/learning/lesson.service';
import { Flashcard } from './Flashcard';
import { GrammarCard } from './GrammarCard';
import { QuizCard } from './QuizCard';
import { VocabularyCard } from './VocabularyCard';

describe('learning components', () => {
  it('reveals flashcard content and reports confidence', () => {
    const onConfidence = vi.fn();
    const onMarkForReview = vi.fn();

    render(
      <Flashcard
        front="학교"
        back="Trường học"
        onConfidence={onConfidence}
        onMarkForReview={onMarkForReview}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Hiện nghĩa' }));
    expect(screen.getByText('Trường học')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /4 · Rất chắc/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Đánh dấu cần ôn' }));

    expect(onConfidence).toHaveBeenCalledWith(4);
    expect(onMarkForReview).toHaveBeenCalledOnce();
  });

  it('renders a vocabulary item with its category and example', () => {
    render(
      <VocabularyCard
        item={{ kr: '학교', vn: 'Trường học', note: '학교에 가요.' }}
        category="기본"
        markedForReview={false}
        onMarkForReview={() => {}}
        onConfidence={() => {}}
      />,
    );

    expect(screen.getByText('기본')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '학교' })).toBeInTheDocument();
  });

  it('renders grammar rules and examples', () => {
    const result = getLessonGrammar(1);
    if (!result.ok || !result.data[0]) throw new Error('Expected lesson 1 grammar data.');

    render(<GrammarCard item={result.data[0]} index={0} />);

    expect(screen.getByText(result.data[0].structure)).toBeInTheDocument();
    expect(screen.getByText(result.data[0].examples[0]?.kr ?? '')).toBeInTheDocument();
  });

  it('selects a quiz answer and displays feedback after submission', () => {
    const result = getLessonQuiz(1);
    if (!result.ok || !result.data[0]) throw new Error('Expected lesson 1 quiz data.');
    const question = result.data[0];
    const onSelect = vi.fn();
    const { rerender } = render(<QuizCard question={question} onSelect={onSelect} />);

    fireEvent.click(screen.getByRole('button', { name: /A/ }));
    expect(onSelect).toHaveBeenCalledWith(0);

    rerender(<QuizCard question={question} selectedAnswer={0} submitted onSelect={onSelect} />);
    expect(screen.getByRole('status')).toHaveTextContent(/Chính xác\.|Chưa chính xác\./);
    expect(screen.getByText(question.explanation)).toBeInTheDocument();
  });
});
