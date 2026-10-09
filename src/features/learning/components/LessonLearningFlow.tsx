import { Link } from 'react-router-dom';
import { EmptyState } from '../../../components/ui/EmptyState';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Button } from '../../../components/ui/Button';
import { GrammarCard } from '../../../components/learning/GrammarCard';
import { QuizCard } from '../../../components/learning/QuizCard';
import { VocabularyCard } from '../../../components/learning/VocabularyCard';
import { useLessonFlow, getVocabularyReviewId } from '../state/use-lesson-flow';

export function LessonLearningFlow({ lessonId }: { lessonId: number }) {
  const {
    lessonResult,
    grammarResult,
    quizResult,
    answers,
    result,
    reviewedVocabulary,
    loading,
    error,
    markVocabularyForReview,
    rateVocabulary,
    selectAnswer,
    submitPractice,
  } = useLessonFlow(lessonId);

  if (!lessonResult.ok) {
    return (
      <section className="page-panel">
        <EmptyState
          title="Không tìm thấy bài học"
          description={lessonResult.error.message}
          headingLevel="h1"
          role="alert"
          action={
            <Link className="button button--secondary button--md" to="/learn">
              Quay lại Learn
            </Link>
          }
        />
      </section>
    );
  }

  const lesson = lessonResult.data;
  if (loading) {
    return (
      <section className="page-panel" aria-label="Đang tải bài học">
        <Skeleton height="48px" />
        <Skeleton height="160px" />
      </section>
    );
  }

  if (!grammarResult.ok || !quizResult.ok) {
    return (
      <section className="page-panel">
        <EmptyState
          title="Không tải được bài học"
          description="Dữ liệu bài học hiện chưa sẵn sàng."
          role="alert"
        />
      </section>
    );
  }

  const recallItems = lesson.vocabulary
    .flatMap((pack, packIndex) =>
      pack.items.slice(0, 2).map((item, itemIndex) => ({ item, pack, packIndex, itemIndex })),
    )
    .slice(0, 4);
  const allAnswered =
    quizResult.data.length > 0 &&
    quizResult.data.every((question) => typeof answers[String(question.id)] === 'number');

  return (
    <section className="page-panel lesson-flow">
      <PageHeader
        eyebrow={`Bài ${String(lesson.id).padStart(2, '0')} · ${lesson.koreanTitle}`}
        title={`Bài ${String(lesson.id).padStart(2, '0')}`}
        description={`${lesson.title} · ${lesson.objectives}`}
        action={
          <Link className="button button--secondary button--md" to="/learn">
            Quay lại Learn
          </Link>
        }
      />

      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="learning-checklist" role="region" aria-label="Tiến độ bài học">
        <span className="learning-checklist__item">
          {reviewedVocabulary.size > 0 ? '✅' : '⚪'} 01 Nhớ lại & Từ vựng (
          {reviewedVocabulary.size} từ đã xem)
        </span>
        <span className="learning-checklist__item">
          ✅ 02 Ngữ pháp ({grammarResult.data.length} cấu trúc)
        </span>
        <span className="learning-checklist__item">
          {result ? '✅' : allAnswered ? '🟡' : '⚪'} 03 Luyện tập ({Object.keys(answers).length}/
          {quizResult.data.length} câu)
        </span>
      </div>

      <section className="lesson-flow__section" aria-labelledby="recall-title">
        <div className="lesson-section-heading">
          <div>
            <p className="eyebrow">01</p>
            <h2 id="recall-title">Nhớ lại trước khi xem</h2>
          </div>
          <p>Tự nhớ nghĩa, sau đó chọn mức độ tự tin từ 1 đến 4.</p>
        </div>
        <div className="learning-card-grid">
          {recallItems.map(({ item, pack, packIndex, itemIndex }) => {
            const itemId = getVocabularyReviewId(lessonId, packIndex, itemIndex);
            return (
              <VocabularyCard
                key={itemId}
                item={item}
                category={pack.category}
                markedForReview={reviewedVocabulary.has(itemId)}
                onMarkForReview={() => void markVocabularyForReview(itemId)}
                onConfidence={(confidence) => void rateVocabulary(itemId, confidence)}
              />
            );
          })}
        </div>
      </section>

      <section className="lesson-flow__section" aria-labelledby="vocabulary-title">
        <div className="lesson-section-heading">
          <div>
            <p className="eyebrow">02</p>
            <h2 id="vocabulary-title">Từ vựng</h2>
          </div>
          <p>{lesson.vocabulary.reduce((count, pack) => count + pack.items.length, 0)} mục từ</p>
        </div>
        {lesson.vocabulary.map((pack, packIndex) => (
          <section key={`${pack.category}-${packIndex}`} className="vocabulary-pack">
            <h3>{pack.category}</h3>
            <div className="learning-card-grid">
              {pack.items.map((item, itemIndex) => {
                const itemId = getVocabularyReviewId(lessonId, packIndex, itemIndex);
                return (
                  <VocabularyCard
                    key={itemId}
                    item={item}
                    category={pack.sourceTag}
                    markedForReview={reviewedVocabulary.has(itemId)}
                    onMarkForReview={() => void markVocabularyForReview(itemId)}
                    onConfidence={(confidence) => void rateVocabulary(itemId, confidence)}
                  />
                );
              })}
            </div>
          </section>
        ))}
      </section>

      <section className="lesson-flow__section" aria-labelledby="grammar-title">
        <div className="lesson-section-heading">
          <div>
            <p className="eyebrow">03</p>
            <h2 id="grammar-title">Ngữ pháp</h2>
          </div>
          <p>{grammarResult.data.length} cấu trúc</p>
        </div>
        <div className="grammar-grid">
          {grammarResult.data.map((item, index) => (
            <GrammarCard key={`${item.structure}-${index}`} item={item} index={index} />
          ))}
        </div>
      </section>

      <section className="lesson-flow__section" aria-labelledby="practice-title">
        <div className="lesson-section-heading">
          <div>
            <p className="eyebrow">04</p>
            <h2 id="practice-title">Luyện tập nhanh</h2>
          </div>
          <p>{quizResult.data.length} câu hỏi</p>
        </div>
        {quizResult.data.length ? (
          <div className="quiz-list">
            {quizResult.data.map((question) => (
              <QuizCard
                key={question.id}
                question={question}
                selectedAnswer={answers[String(question.id)] as number | undefined}
                submitted={result !== null}
                onSelect={(answerIndex) => selectAnswer(question.id, answerIndex)}
              />
            ))}
            {result ? (
              <div className="practice-result" role="status">
                <h3>Bài luyện tập đã hoàn thành</h3>
                <p>
                  Điểm: {result.score}% · Đúng {result.correct}/{result.total}
                </p>
                <p>{result.wrong} câu sai đã được thêm vào danh sách ôn tập.</p>
                <Link className="button button--primary button--md" to="/review">
                  Đi đến ôn tập
                </Link>
              </div>
            ) : (
              <>
                {reviewedVocabulary.size === 0 ? (
                  <p className="muted-copy" role="note">
                    💡 Gợi ý: Hãy thử tự nhớ một vài từ vựng ở phần 01 trước khi hoàn thành bài học
                    để tăng hiệu quả ghi nhớ.
                  </p>
                ) : null}
                <Button disabled={!allAnswered} onClick={() => void submitPractice()}>
                  Hoàn thành bài học
                </Button>
              </>
            )}
          </div>
        ) : (
          <EmptyState
            title="Chưa có câu hỏi luyện tập"
            description="Nội dung bài học vẫn có thể xem lại; câu hỏi sẽ được bổ sung sau."
          />
        )}
      </section>
    </section>
  );
}
