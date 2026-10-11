import { useEffect, useRef, useState } from 'react';
import type { ListeningPassage } from '../../data/schemas/listening.schema';
import { useKoreanSpeech } from '../../services/audio/use-korean-speech';
import { Button } from '../ui/Button';

export function ListeningPlayer({ passage }: { passage: ListeningPassage }) {
  const speech = useKoreanSpeech();
  const [rate, setRate] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [audioKey, setAudioKey] = useState(0);
  const audio = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    const element = audio.current;
    return () => {
      element?.pause();
    };
  }, [passage.id, audioKey]);
  return (
    <div className="listening-player card">
      <label>
        Tốc độ nghe
        <select
          value={rate}
          disabled={speech.playing}
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
            onPlay={() => {
              const element = audio.current;
              speech.claimRecorded(() => element?.pause());
            }}
            onPause={speech.stop}
            onEnded={speech.stop}
            onError={() => {
              speech.stop();
              setError('Không tải được audio. Hãy thử lại.');
            }}
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
          <Button
            disabled={speech.playing || !speech.available}
            onClick={() => speech.play(passage.transcript, rate)}
          >
            {speech.playing ? 'Đang nghe...' : 'Nghe bài'}
          </Button>
          <Button variant="secondary" disabled={!speech.playing} onClick={speech.stop}>
            Dừng nghe
          </Button>
          {!speech.available ? (
            <p role="status">
              Thiết bị chưa có giọng đọc tiếng Hàn. Bài nghe chưa phát được trên thiết bị này.
            </p>
          ) : null}
          <Button variant="secondary" onClick={speech.refreshVoices}>
            Tải lại danh sách giọng
          </Button>
        </>
      )}
      {error || speech.error ? (
        <p className="form-error" role="alert">
          {error ?? speech.error}
        </p>
      ) : null}
    </div>
  );
}
