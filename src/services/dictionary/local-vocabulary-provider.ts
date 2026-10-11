import { adaptVocabulary } from '../../domain/vocabulary/vocabulary.adapter';
import { createVocabularyIndex } from '../../domain/vocabulary/vocabulary-index';
import { VOCABULARY_ENRICHMENT } from '../../data/vocabulary-enrichment';

export const localVocabulary = createVocabularyIndex(adaptVocabulary(VOCABULARY_ENRICHMENT));
