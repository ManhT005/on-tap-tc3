import { useEffect, useState, useSyncExternalStore } from 'react';
import { getKoreanVoices, koreanSpeech } from './korean-speech.service';

export function useKoreanSpeech() {
  const [owner] = useState(() => crypto.randomUUID());
  const [voices, setVoices] = useState(getKoreanVoices);
  const playback = useSyncExternalStore(
    koreanSpeech.subscribe,
    koreanSpeech.getSnapshot,
    koreanSpeech.getSnapshot,
  );
  useEffect(() => {
    const id = owner;
    const synth =
      typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
    const refresh = () => setVoices(getKoreanVoices());
    synth?.addEventListener('voiceschanged', refresh);
    return () => {
      synth?.removeEventListener('voiceschanged', refresh);
      koreanSpeech.stop(id);
    };
  }, [owner]);
  return {
    available: voices.length > 0,
    playing: playback.owner === owner && playback.playing,
    error: playback.owner === owner ? playback.error : null,
    refreshVoices: () => setVoices(getKoreanVoices()),
    play: (text: string, rate: number) => koreanSpeech.play(owner, text, rate),
    stop: () => koreanSpeech.stop(owner),
    claimRecorded: (pause: () => void) => koreanSpeech.claimRecorded(owner, pause),
  };
}
