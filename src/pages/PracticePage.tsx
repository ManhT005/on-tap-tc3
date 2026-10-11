import { useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { QuizPractice } from '../features/practice/components/QuizPractice';
import { ReadingPractice } from '../features/practice/components/ReadingPractice';
import { WritingPractice } from '../features/practice/components/WritingPractice';
import { ListeningPractice } from '../features/practice/components/ListeningPractice';
import { ExamPractice } from '../features/practice/components/ExamPractice';

type PracticeMode = 'quiz' | 'reading' | 'writing' | 'listening' | 'exam';

const practiceModes: { id: PracticeMode; label: string }[] = [
  { id: 'quiz', label: 'Quiz' },
  { id: 'reading', label: 'Reading' },
  { id: 'writing', label: 'Writing' },
  { id: 'listening', label: 'Listening' },
  { id: 'exam', label: 'Exam' },
];

export function PracticePage() {
  const [mode, setMode] = useState<PracticeMode>('quiz');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    let nextIndex = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % practiceModes.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + practiceModes.length) % practiceModes.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = practiceModes.length - 1;
    }

    if (nextIndex >= 0) {
      e.preventDefault();
      const nextMode = practiceModes[nextIndex]!.id;
      setMode(nextMode);
      const nextTab = document.getElementById(`practice-tab-${nextMode}`);
      nextTab?.focus();
    }
  };

  return (
    <section className="page-panel">
      <PageHeader
        eyebrow="Luyện tập"
        title="Practice"
        description="Luyện tập theo kỹ năng và xem kết quả đã lưu."
      />

      <div className="practice-tabs" role="tablist" aria-label="Chế độ luyện tập">
        {practiceModes.map((item, index) => (
          <button
            key={item.id}
            id={`practice-tab-${item.id}`}
            className={mode === item.id ? 'practice-tab practice-tab--active' : 'practice-tab'}
            type="button"
            role="tab"
            tabIndex={mode === item.id ? 0 : -1}
            aria-selected={mode === item.id}
            aria-controls={`practice-panel-${item.id}`}
            onClick={() => setMode(item.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <section
        id={`practice-panel-${mode}`}
        className="practice-panel"
        role="tabpanel"
        aria-labelledby={`practice-tab-${mode}`}
        tabIndex={0}
      >
        {mode === 'quiz' ? <QuizPractice /> : null}
        {mode === 'reading' ? <ReadingPractice /> : null}
        {mode === 'writing' ? <WritingPractice /> : null}
        {mode === 'listening' ? <ListeningPractice /> : null}
        {mode === 'exam' ? <ExamPractice /> : null}
      </section>
    </section>
  );
}
