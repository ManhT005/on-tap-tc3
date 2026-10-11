export type GrammarExampleProps = {
  example: { kr: string; vn: string };
};

export function GrammarExample({ example }: GrammarExampleProps) {
  return (
    <li className="grammar-example">
      <p lang="ko">{example.kr}</p>
      <p>{example.vn}</p>
    </li>
  );
}
