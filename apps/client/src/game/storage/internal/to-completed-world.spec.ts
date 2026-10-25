import { describe, expect, it } from 'vitest';

import type { CompletedWorld } from '../types/completed-world';
import { toCompletedWorld } from './to-completed-world';

const REPLAY = { worldName: 'ABC', steps: 1, entries: [[0, 1]] };

const WORLD = {
  name: 'ABC',
  day: '2026-09-04',
  score: 900,
  seconds: 61,
  runId: 'RUN-1',
  replay: REPLAY,
};

describe('toCompletedWorld', () => {
  it('should read every field when the world was stored whole', () => {
    expect(toCompletedWorld(WORLD)).toEqual(WORLD);
  });

  it('should drop the replay when it did not survive the trip', () => {
    expect(
      toCompletedWorld({
        ...WORLD,
        replay: { worldName: 'ABC' } as unknown as CompletedWorld['replay'],
      }).replay,
    ).toBeNull();
  });

  it('should fill in empty fields when the world was stored with nothing', () => {
    expect(toCompletedWorld({})).toEqual({
      name: '',
      day: '',
      score: 0,
      seconds: 0,
      runId: '',
      replay: null,
    });
  });
});
