import {
  addRecordedAction,
  createRecorder,
  type GameState,
  toReplay,
} from '@mander/engine';
import { describe, expect, it } from 'vitest';
import { shallowRef } from 'vue';

import { toOriginReplay } from './to-origin-replay';

describe('toOriginReplay', () => {
  it('should take the recording made so far when the replay comes from the game', () => {
    const recorder = addRecordedAction(createRecorder('ABC'), {
      type: 'MOVE_RIGHT_START',
    });

    expect(
      toOriginReplay({
        kind: 'GAME',
        recorder: shallowRef(recorder),
        state: shallowRef({} as unknown as GameState),
      }),
    ).toEqual(toReplay(recorder));
  });

  it('should take the stored recording when the replay comes from the archive', () => {
    const recording = { worldName: 'ABC', steps: 4, entries: [] };

    expect(toOriginReplay({ kind: 'ARCHIVE', recording })).toBe(recording);
  });
});
