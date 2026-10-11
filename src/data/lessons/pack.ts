export function pack(sourceTag: string, category: string, tuples: string[][]) {
  return {
    category,
    sourceTag,
    items: tuples.map(([kr, vn, note, id]) => ({ id, kr, vn, note: note || '' })),
  };
}
