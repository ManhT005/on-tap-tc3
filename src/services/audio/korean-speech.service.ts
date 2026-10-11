export function getKoreanVoices(): SpeechSynthesisVoice[] {
  try {
    return typeof window !== 'undefined' && 'speechSynthesis' in window
      ? window.speechSynthesis.getVoices().filter((voice) => /^ko(?:-|_|$)/i.test(voice.lang))
      : [];
  } catch {
    return [];
  }
}
type Playback = { owner: string | null; playing: boolean; error: string | null };
const idle: Playback = { owner: null, playing: false, error: null };

/** One playback owner across speech and recorded players. */
export class KoreanSpeechController {
  private state: Playback = idle;
  private listeners = new Set<() => void>();
  private cancelPlayback: (() => void) | null = null;
  private generation = 0;
  private timeout: ReturnType<typeof setTimeout> | undefined;
  getSnapshot = () => this.state;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  private publish(state: Playback) {
    this.state = state;
    this.listeners.forEach((listener) => listener());
  }
  stop(owner?: string) {
    if (owner && this.state.owner !== owner) return;
    this.generation++;
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = undefined;
    const cancel = this.cancelPlayback;
    this.cancelPlayback = null;
    this.publish(idle);
    cancel?.();
  }
  claimRecorded(owner: string, pause: () => void) {
    this.stop();
    this.cancelPlayback = pause;
    this.publish({ owner, playing: true, error: null });
  }
  play(owner: string, rawText: string, rate: number = 1) {
    this.stop();
    const text = Array.from(rawText.normalize('NFC'))
      .filter((character) => {
        const code = character.charCodeAt(0);
        return code >= 32 || code === 9 || code === 10 || code === 13;
      })
      .join('')
      .trim();
    const voice = getKoreanVoices()[0];
    const fail = (message: string) => {
      this.stop(owner);
      this.publish({ owner, playing: false, error: message });
    };
    if (!text || text.length > 5000 || ![0.75, 1, 1.25].includes(rate)) {
      fail('Nội dung phát âm không hợp lệ hoặc quá dài (tối đa 5.000 ký tự).');
      return;
    }
    if (!voice || typeof window === 'undefined' || !('SpeechSynthesisUtterance' in window)) {
      fail(
        'Thiết bị chưa có giọng đọc tiếng Hàn. Cài giọng Hàn trong hệ điều hành rồi tải lại danh sách giọng.',
      );
      return;
    }
    const ticket = this.generation;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.voice = voice;
    utterance.rate = rate;
    this.cancelPlayback = () => window.speechSynthesis.cancel();
    this.publish({ owner, playing: true, error: null });
    this.timeout = setTimeout(() => {
      if (ticket === this.generation) fail('Giọng đọc chưa bắt đầu. Hãy thử nghe lại.');
    }, 8000);
    utterance.addEventListener('start', () => {
      if (ticket === this.generation && this.timeout) clearTimeout(this.timeout);
    });
    utterance.addEventListener('end', () => {
      if (ticket === this.generation) this.stop(owner);
    });
    utterance.addEventListener('error', () => {
      if (ticket === this.generation) fail('Không phát được giọng đọc. Hãy thử nghe lại.');
    });
    try {
      window.speechSynthesis.speak(utterance);
    } catch {
      fail('Không phát được giọng đọc. Hãy thử nghe lại.');
    }
  }
}
export const koreanSpeech = new KoreanSpeechController();
