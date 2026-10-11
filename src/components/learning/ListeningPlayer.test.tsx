import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ListeningPlayer } from './ListeningPlayer';
import { LISTENING_BANK } from '../../data/listening-bank';

describe('listening playback recovery', () => {
  it('supports a recorded asset failure and remounts its player on retry', () => {
    const passage = {
      ...LISTENING_BANK[0]!,
      playback: 'recorded' as const,
      audio: {
        url: '/fixtures/missing.wav',
        durationSeconds: 1,
        codec: 'pcm',
        source: 'test fixture only',
        license: 'test',
        rightsApproved: false,
      },
    };
    const { container } = render(<ListeningPlayer passage={passage} />);
    const original = container.querySelector('audio')!;
    fireEvent.error(original);
    expect(screen.getByRole('alert')).toHaveTextContent('Không tải được audio');
    fireEvent.click(screen.getByRole('button', { name: 'Tải lại audio' }));
    expect(container.querySelector('audio')).not.toBe(original);
    expect(screen.queryByRole('alert')).toBeNull();
  });
});
