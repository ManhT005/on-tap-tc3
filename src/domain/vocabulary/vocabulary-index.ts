import type { VocabularyEntry } from './vocabulary.types';

type Trie = { children: Map<string, Trie>; entries: VocabularyEntry[] };
export function createVocabularyIndex(entries: VocabularyEntry[]) {
  const root: Trie = { children: new Map(), entries: [] };
  const surfaces = new Map<string, VocabularyEntry[]>();
  const byId = new Map(entries.map((entry) => [entry.id, entry]));
  for (const entry of entries) {
    for (const surface of new Set([
      entry.korean,
      ...(entry.reviewStatus === 'approved' ? (entry.lookupAliases ?? []) : []),
    ])) {
      const normalized = surface.normalize('NFC').trim();
      const candidates = surfaces.get(normalized) ?? [];
      candidates.push(entry);
      surfaces.set(normalized, candidates);
      let node = root;
      for (const character of normalized) {
        if (!node.children.has(character))
          node.children.set(character, { children: new Map(), entries: [] });
        node = node.children.get(character)!;
      }
      if (!node.entries.some((candidate) => candidate.id === entry.id)) node.entries.push(entry);
    }
  }
  const prefer = (candidates: VocabularyEntry[], lessonId?: number) =>
    [...candidates].sort(
      (a, b) =>
        Number(b.lessonId === lessonId) - Number(a.lessonId === lessonId) ||
        a.id.localeCompare(b.id),
    );
  return {
    root,
    byId,
    lookup: (surface: string, lessonId?: number) =>
      prefer(surfaces.get(surface.normalize('NFC').trim()) ?? [], lessonId),
    search: (query: string, lessonId?: number) => {
      const value = query.normalize('NFC').trim().toLocaleLowerCase('vi');
      return value
        ? prefer(
            entries.filter((entry) =>
              `${entry.korean} ${entry.vietnamese}`.toLocaleLowerCase('vi').includes(value),
            ),
            lessonId,
          ).slice(0, 20)
        : [];
    },
    prefer,
  };
}
export type VocabularyIndex = ReturnType<typeof createVocabularyIndex>;
