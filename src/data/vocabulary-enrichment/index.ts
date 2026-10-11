import type { VocabularyEnrichment } from '../../domain/vocabulary/vocabulary.types';

// Editorial pilot only. No examples or aliases are exposed as approved learning content.
export const VOCABULARY_ENRICHMENT: Record<string, VocabularyEnrichment> = {
  'vocab-01-0001': {
    sourceRef: 'authored:Vocabulary Lab editorial pilot, 2026-10-11',
    reviewStatus: 'pending',
    examples: [
      {
        kr: '이번 학기에는 새로운 과목을 배워요.',
        vn: 'Học kỳ này tôi học môn học mới.',
        targetRange: [3, 5],
        reviewStatus: 'pending',
      },
    ],
    lookupAliases: ['학기에는'],
  },
  'vocab-01-0005': {
    sourceRef: 'authored:Vocabulary Lab editorial pilot, 2026-10-11',
    reviewStatus: 'pending',
    examples: [
      {
        kr: '이번 학기에는 전공과목 두 개를 신청했어요.',
        vn: 'Học kỳ này tôi đăng ký hai môn chuyên ngành.',
        targetRange: [8, 12],
        reviewStatus: 'pending',
      },
    ],
    lookupAliases: ['전공과목을'],
  },
  'vocab-02-0001': {
    sourceRef: 'authored:Vocabulary Lab editorial pilot, 2026-10-11',
    reviewStatus: 'pending',
    examples: [
      {
        kr: '대인 관계는 사회생활에서 중요해요.',
        vn: 'Quan hệ với người khác rất quan trọng trong đời sống xã hội.',
        targetRange: [0, 5],
        reviewStatus: 'pending',
      },
    ],
  },
  'vocab-03-0001': {
    sourceRef: 'authored:Vocabulary Lab editorial pilot, 2026-10-11',
    reviewStatus: 'pending',
    examples: [
      {
        kr: '규칙적으로 운동하면 건강해질 수 있어요.',
        vn: 'Nếu tập thể dục đều đặn, bạn có thể trở nên khỏe mạnh.',
        reviewStatus: 'pending',
      },
    ],
    lookupAliases: ['건강해질'],
  },
};
