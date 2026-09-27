export function pack(sourceTag: string, category: string, tuples: string[][]) {
  return {
    category,
    sourceTag,
    items: tuples.map(([kr, vn, note]) => ({ kr, vn, note: note || '' })),
  };
}
