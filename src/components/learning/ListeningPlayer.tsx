import { useEffect, useRef, useState } from 'react';
import type { ListeningPassage } from '../../data/schemas/listening.schema';
import { Button } from '../ui/Button';

function koreanVoices() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
    ? window.speechSynthesis.getVoices().filter((voice) => /^ko(?:-|_|$)/i.test(voice.lang))
    : [];
}

export function ListeningPlayer({ passage }: { passage: ListeningPassage }) {
  const [voices, setVoices] = useState(koreanVoices);
  const [rate, setRate] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioKey, setAudioKey] = useState(0);
  const audio = useRef<HTMLAudioElement | null>(null);
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);
  const generation = useRef(0);
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;
    const refresh = () => setVoices(koreanVoices());
    synth.addEventListener('voiceschanged', refresh);
    return () => {
      synth.removeEventListener('voiceschanged', refresh);
      if (utterance.current) synth.cancel();
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, []);

  function stop() {
    generation.current++;
    if (timeout.current) clearTimeout(timeout.current);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    utterance.current = null;
    setPlaying(false);
  }
  function play() {
    stop();
    setError(null);
    const voice = voices[0];
    if (!voice || !('SpeechSynthesisUtterance' in window)) {
      setError(
        'Thiết bị chưa có giọng đọc tiếng Hàn. Hãy tải lại danh sách giọng hoặc dùng thiết bị có giọng Hàn.',
      );
      return;
    }
    const sequence = generation.current;
    const next = new SpeechSynthesisUtterance(passage.transcript);
    next.lang = 'ko-KR';
    next.voice = voice;
    next.rate = rate;
    utterance.current = next;
    setPlaying(true);
    timeout.current = setTimeout(() => {
      if (generation.current === sequence) {
        stop();
        setError('Giọng đọc chưa bắt đầu. Hãy thử nghe lại.');
      }
    }, 8000);
    next.addEventListener('start', () => {
      if (timeout.current) clearTimeout(timeout.current);
    });
    next.addEventListener('end', () => {
      if (generation.current === sequence) {
        setPlaying(false);
        utterance.current = null;
      }
    });
    next.addEventListener('error', () => {
      if (generation.current === sequence) {
        stop();
        setError('Không phát được giọng đọc. Hãy thử nghe lại.');
      }
    });
    try {
      window.speechSynthesis.speak(next);
    } catch {
      stop();
      setError('Không phát được giọng đọc. Hãy thử nghe lại.');
    }
  }
  return (
    <div className="listening-player card">
      <label>
        Tốc độ nghe
        <select
          value={rate}
          disabled={playing}
          onChange={(event) => {
            const next = Number(event.target.value);
            setRate(next);
            if (audio.current) audio.current.playbackRate = next;
          }}
        >
          <option value={0.75}>0.75x</option>
          <option value={1}>1x</option>
          <option value={1.25}>1.25x</option>
        </select>
      </label>
      {passage.playback === 'recorded' && passage.audio ? (
        <>
          <audio
            key={audioKey}
            ref={audio}
            controls
            preload="none"
            aria-label={`Audio: ${passage.title}`}
            src={passage.audio.url}
            onLoadedMetadata={() => {
              if (audio.current) audio.current.playbackRate = rate;
            }}
            onError={() => setError('Không tải được audio. Hãy thử lại.')}
          />
          {error ? (
            <Button
              variant="secondary"
              onClick={() => {
                setError(null);
                setAudioKey((value) => value + 1);
              }}
            >
              Tải lại audio
            </Button>
          ) : null}
        </>
      ) : (
        <>
          <p>
            Nghe bằng giọng đọc tiếng Hàn của thiết bị. Đây là giọng tổng hợp; chất lượng và khả
            năng nghe offline phụ thuộc thiết bị.
          </p>
          <Button disabled={playing || voices.length === 0} onClick={play}>
            {playing ? 'Đang nghe...' : 'Nghe bài'}
          </Button>
          <Button variant="secondary" disabled={!playing} onClick={stop}>
            Dừng nghe
          </Button>
          {voices.length === 0 ? (
            <p role="status">
              Thiết bị chưa có giọng đọc tiếng Hàn. Bài nghe chưa phát được trên thiết bị này.
            </p>
          ) : null}
          <Button variant="secondary" onClick={() => setVoices(koreanVoices())}>
            Tải lại danh sách giọng
          </Button>
        </>
      )}
      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
