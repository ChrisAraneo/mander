import { describe, expect, it } from 'vitest';

import type { CompletedWorld } from '../types/completed-world';
import type { SaveData } from '../types/save-data';
import { findCompletedWorld } from './find-completed-world';

const WORLD: CompletedWorld = {
  name: 'ABC',
  day: '2026-09-04',
  score: 900,
  seconds: 61,
  runId: 'RUN-1',
  replay: null,
};

const createSave = (completedWorlds: CompletedWorld[]): SaveData => ({
  score: 0,
  completedWorlds,
  playedWorlds: [],
  runs: [],
});

describe('findCompletedWorld', () => {
  it('should give the finished world when the save holds one with that name', () => {
    expect(
      findCompletedWorld(createSave([{ ...WORLD, name: 'XYZ' }, WORLD]), 'ABC'),
    ).toBe(WORLD);
  });

  it('should give nothing when the world was never finished', () => {
    expect(findCompletedWorld(createSave([WORLD]), 'XYZ')).toBeNull();
  });

  it('should give nothing when the save holds no finished worlds', () => {
    expect(findCompletedWorld(createSave([]), 'ABC')).toBeNull();
  });
});
