import { afterEach, describe, expect, it, vi } from 'vitest';
import { KoreanSpeechController } from './korean-speech.service';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
function setup() {
  const utterances: EventTarget[] = [];
  const cancel = vi.fn();
  class Utterance extends EventTarget {
    lang = '';
    voice: unknown;
    rate = 1;
    constructor(public text: string) {
      super();
    }
  }
  vi.stubGlobal('SpeechSynthesisUtterance', Utterance);
  vi.stubGlobal('speechSynthesis', {
    getVoices: () => [{ lang: 'en-US' }, { lang: 'ko-KR' }],
    cancel,
    speak: (utterance: EventTarget) => utterances.push(utterance),
  });
  return { controller: new KoreanSpeechController(), utterances, cancel };
}
describe('shared Korean playback', () => {
  it('chooses Korean, stops prior owner and ignores stale callbacks/cleanup', () => {
    const { controller, utterances, cancel } = setup();
    controller.play('listening', '안녕하세요.', 0.75);
    expect(utterances[0]).toMatchObject({ lang: 'ko-KR', rate: 0.75, voice: { lang: 'ko-KR' } });
    controller.play('card', '학기', 1);
    expect(cancel).toHaveBeenCalledTimes(1);
    utterances[0]!.dispatchEvent(new Event('error'));
    controller.stop('listening');
    expect(controller.getSnapshot()).toEqual({ owner: 'card', playing: true, error: null });
    controller.stop();
  });
  it('coordinates recorded media with TTS and times out/retries failed speech', () => {
    vi.useFakeTimers();
    const { controller, utterances } = setup();
    const pause = vi.fn();
    controller.claimRecorded('recorded', pause);
    controller.play('word', '학기', 1);
    expect(pause).toHaveBeenCalledOnce();
    vi.advanceTimersByTime(8000);
    expect(controller.getSnapshot().error).toContain('chưa bắt đầu');
    controller.play('word', '학기', 1.25);
    utterances[1]!.dispatchEvent(new Event('start'));
    vi.advanceTimersByTime(9000);
    expect(controller.getSnapshot().playing).toBe(true);
    utterances[1]!.dispatchEvent(new Event('end'));
    expect(controller.getSnapshot().playing).toBe(false);
  });
  it('does not use English as a fallback and rejects oversized content', () => {
    const { controller } = setup();
    vi.stubGlobal('speechSynthesis', { getVoices: () => [{ lang: 'en-US' }] });
    controller.play('card', '학기', 1);
    expect(controller.getSnapshot().error).toContain('chưa có giọng');
    controller.play('card', '한'.repeat(5001), 1);
    expect(controller.getSnapshot().error).toContain('quá dài');
  });
});
