import { useState } from 'react';
import { useKoreanSpeech } from '../../services/audio/use-korean-speech';
import { Button } from '../ui/Button';

export function KoreanSpeechControls({
  text,
  label = 'Nghe phát âm',
  compact = false,
}: {
  text: string;
  label?: string;
  compact?: boolean;
}) {
  const speech = useKoreanSpeech();
  const [rate, setRate] = useState(1);
  return (
    <div className={`korean-speech-controls${compact ? ' korean-speech-controls--compact' : ''}`}>
      <label>
        <span>Tốc độ phát âm</span>
        <select
          value={rate}
          disabled={speech.playing}
          onChange={(event) => setRate(Number(event.target.value))}
        >
          <option value={0.75}>0.75x</option>
          <option value={1}>1x</option>
          <option value={1.25}>1.25x</option>
        </select>
      </label>
      <Button
        variant="secondary"
        disabled={!speech.available || speech.playing}
        onClick={() => speech.play(text, rate)}
      >
        {speech.playing ? 'Đang phát âm...' : label}
      </Button>
      {speech.playing ? (
        <Button variant="ghost" onClick={speech.stop}>
          Dừng phát âm
        </Button>
      ) : null}
      {!speech.available && compact ? (
        <details className="speech-help">
          <summary>Chưa có giọng Hàn · Xem hướng dẫn</summary>
          <p>Cài giọng đọc tiếng Hàn trong cài đặt hệ điều hành rồi tải lại danh sách giọng.</p>
          <Button variant="ghost" onClick={speech.refreshVoices}>
            Tải lại danh sách giọng
          </Button>
        </details>
      ) : !speech.available ? (
        <>
          <p role="status">
            Thiết bị chưa có giọng đọc tiếng Hàn. Cài giọng Hàn trong hệ điều hành hoặc dùng thiết
            bị hỗ trợ.
          </p>
          <Button variant="ghost" onClick={speech.refreshVoices}>
            Tải lại danh sách giọng
          </Button>
        </>
      ) : null}
      {speech.error ? (
        <p role="alert" className="form-error">
          {speech.error}
        </p>
      ) : null}
    </div>
  );
}
