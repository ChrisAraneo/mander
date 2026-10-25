import type { GameState } from '@mander/engine';
import { describe, expect, it } from 'vitest';

import { createBackdropStartFrame } from './create-backdrop-start-frame';

describe('createBackdropStartFrame', () => {
  it('should show the idle state on both sides when the backdrop starts', () => {
    const state = { time: 0 } as unknown as GameState;

    const frame = createBackdropStartFrame(state);

    expect(frame.previous).toBe(state);
    expect(frame.current).toBe(state);
  });
});
