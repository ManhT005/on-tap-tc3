import type { LessonContent } from '../../data/schemas';
import { Card } from '../ui/Card';
import { GrammarExample } from './GrammarExample';

export type GrammarCardProps = {
  item: LessonContent['grammar'][number];
  index: number;
};

export function GrammarCard({ item, index }: GrammarCardProps) {
  const commonMistakes = Array.isArray(item.commonMistakes)
    ? item.commonMistakes.filter((mistake): mistake is string => typeof mistake === 'string')
    : [];

  return (
    <Card as="article" className="grammar-card">
      <p className="eyebrow">Mẫu {index + 1}</p>
      <h3>{item.structure}</h3>
      <p className="grammar-card__meaning">{item.meaning}</p>
      <p>{item.rule}</p>
      {commonMistakes?.length ? (
        <div className="grammar-card__mistakes">
          <h4>Lỗi thường gặp</h4>
          <ul>
            {commonMistakes.map((mistake) => (
              <li key={mistake}>{mistake}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <h4>Ví dụ</h4>
      <ul className="grammar-examples">
        {item.examples.map((example) => (
          <GrammarExample key={example.kr} example={example} />
        ))}
      </ul>
    </Card>
  );
}
