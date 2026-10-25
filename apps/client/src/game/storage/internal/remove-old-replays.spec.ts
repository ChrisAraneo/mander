import { map, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { CompletedWorld } from '../types/completed-world';
import type { SaveData } from '../types/save-data';
import { removeOldReplays } from './remove-old-replays';

const REPLAY = { worldName: 'ABC', steps: 1, entries: [[0, 0]] };

const createWorld = (index: number): CompletedWorld => ({
  name: `W${index}`,
  day: '',
  score: 0,
  seconds: 0,
  runId: '',
  replay: REPLAY,
});

const createSave = (): SaveData => ({
  score: 7,
  completedWorlds: times(3, createWorld),
  playedWorlds: [],
  runs: [],
});

const hasReplays = (save: SaveData): boolean[] =>
  map(save.completedWorlds, (world) => world.replay !== null);

describe('removeOldReplays', () => {
  it('should keep only the newest replays when it removes the old ones', () => {
    expect(hasReplays(removeOldReplays(createSave(), 1))).toEqual([
      false,
      false,
      true,
    ]);
  });

  it('should keep the finished worlds when it removes their replays', () => {
    expect(
      map(
        removeOldReplays(createSave(), 0).completedWorlds,
        (world) => world.name,
      ),
    ).toEqual(['W0', 'W1', 'W2']);
  });

  it('should keep the rest of the save when it removes the replays', () => {
    const save = createSave();

    const trimmed = removeOldReplays(save, 1);

    expect(trimmed.score).toBe(7);
    expect(trimmed.runs).toBe(save.runs);
    expect(trimmed.playedWorlds).toBe(save.playedWorlds);
  });

  it('should give no worlds when the save holds no finished worlds', () => {
    expect(
      removeOldReplays({ ...createSave(), completedWorlds: [] }, 2)
        .completedWorlds,
    ).toEqual([]);
  });

  it('should not change the old save when it removes the replays', () => {
    const save = createSave();

    removeOldReplays(save, 0);

    expect(save).toEqual(createSave());
  });
});
