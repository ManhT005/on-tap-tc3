# Listening text and audio registry

User confirmed no audio source is currently available. The implementation supplies 30 original short Korean scripts (two per lesson), translations and MCQs in `src/data/listening-bank.ts`. Every script remains pending independent language review.

Current playback is **browser speech synthesis**, selecting a Korean voice from the device. This is provisional playback, not a delivered set of recorded audio files. Voice availability and offline operation depend on the device/provider. See [MDN getVoices](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/getVoices) and [utterance language](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance/lang). No fallback to a non-Korean voice or autoplay is used.

| Asset category | Available | Approved for v1 recorded-audio gate |
| --- | ---: | ---: |
| Listening scripts/translations/MCQs | 30 | 0 language approvals |
| Recorded speech files | 0 | 0 |
| Browser voice playback | Device dependent | Does not satisfy recorded-audio gate |

To replace provisional speech, set each passage playback to recorded and provide audio URL, measured duration, codec, source, license and rights approval. Verify playback, pronunciation, loudness, transcript correspondence and deployment/cache policy. Never mark rights or language approval merely because a URL responds.

Automated evidence covers unsupported/missing voice feedback, synthetic playback failure/retry fixtures, scoring/persistence, and recorded-player network failure/retry. These tests do not prove Korean pronunciation quality or asset rights.
