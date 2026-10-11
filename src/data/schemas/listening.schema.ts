import { z } from 'zod';
import { MultipleChoiceOptionsSchema } from './mcq.schema';

export const ListeningQuestionSchema = z.object({
  id: z.string().min(1),
  question: z.string().trim().min(1),
  options: MultipleChoiceOptionsSchema,
  correctIndex: z.number().int().min(0).max(3),
  evidence: z.string().trim().min(1),
});
export const ListeningPassageSchema = z
  .object({
    id: z.string().min(1),
    lessonId: z.number().int().min(1).max(15),
    title: z.string().min(1),
    transcript: z.string().min(1),
    translation: z.string().min(1),
    sourceType: z.literal('authored'),
    reviewStatus: z.enum(['pending', 'approved']),
    playback: z.enum(['browser-tts', 'recorded']),
    audio: z
      .object({
        url: z.string().min(1),
        durationSeconds: z.number().positive(),
        source: z.string().min(1),
        license: z.string().min(1),
        codec: z.string().min(1),
        rightsApproved: z.boolean(),
      })
      .optional(),
    questions: z.array(ListeningQuestionSchema).min(1),
  })
  .refine(
    (passage) => passage.playback !== 'recorded' || passage.audio !== undefined,
    'Recorded playback requires audio metadata',
  );
export type ListeningPassage = z.infer<typeof ListeningPassageSchema>;
