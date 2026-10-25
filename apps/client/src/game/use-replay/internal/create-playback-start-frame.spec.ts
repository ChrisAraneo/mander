import type { GameState, ReplayPlayback } from '@mander/engine';
import { describe, expect, it } from 'vitest';

import { createPlaybackStartFrame } from './create-playback-start-frame';

const PLAYBACK: ReplayPlayback = {
  step: 0,
  index: 0,
  state: { time: 0 } as unknown as GameState,
};

describe('createPlaybackStartFrame', () => {
  it('should keep the playback it is given when it creates the frame', () => {
    expect(createPlaybackStartFrame(PLAYBACK).playback).toBe(PLAYBACK);
  });

  it('should have nothing behind the opening state when it creates the frame', () => {
    expect(createPlaybackStartFrame(PLAYBACK).previous).toBe(PLAYBACK.state);
  });
});
