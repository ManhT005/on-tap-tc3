export type VocabularyExample = {
  kr: string;
  vn: string;
  targetRange?: [number, number];
  reviewStatus: 'pending' | 'approved';
};
export type VocabularyEnrichment = {
  examples: VocabularyExample[];
  lookupAliases?: string[];
  partOfSpeech?: string;
  memoryHint?: string;
  sourceRef: string;
  reviewStatus: 'pending' | 'approved';
  reviewer?: string;
  reviewedAt?: string;
};
export type VocabularyEntry = {
  id: string;
  lessonId: number;
  korean: string;
  vietnamese: string;
  source: 'basic' | 'new-word' | 'listening' | 'supplemental';
  category: string;
  collocations: string[];
} & Partial<VocabularyEnrichment>;
export type VocabularyFilter = 'all' | 'basic' | 'new-word' | 'listening' | 'unseen' | 'review';
