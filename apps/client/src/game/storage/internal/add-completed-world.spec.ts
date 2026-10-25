import { describe, expect, it } from 'vitest';

import type { CompletedWorld } from '../types/completed-world';
import type { SaveData } from '../types/save-data';
import { addCompletedWorld } from './add-completed-world';

const createWorld = (name: string, score: number): CompletedWorld => ({
  name,
  day: '2026-09-04',
  score,
  seconds: 30,
  runId: `${name}-${score}`,
  replay: null,
});

const createSave = (completedWorlds: CompletedWorld[]): SaveData => ({
  score: 0,
  completedWorlds,
  playedWorlds: [],
  runs: [],
});

describe('addCompletedWorld', () => {
  it('should file the world when it is finished for the first time', () => {
    expect(
      addCompletedWorld(createSave([]), createWorld('ABC', 500))
        .completedWorlds,
    ).toEqual([createWorld('ABC', 500)]);
  });

  it('should keep the new run as the record when it scores higher', () => {
    expect(
      addCompletedWorld(
        createSave([createWorld('ABC', 500)]),
        createWorld('ABC', 900),
      ).completedWorlds,
    ).toEqual([createWorld('ABC', 900)]);
  });

  it('should keep the earlier record when the new run scores less', () => {
    expect(
      addCompletedWorld(
        createSave([createWorld('ABC', 500)]),
        createWorld('ABC', 100),
      ).completedWorlds,
    ).toEqual([createWorld('ABC', 500)]);
  });

  it('should keep the earlier record when the new run scores the same', () => {
    expect(
      addCompletedWorld(
        createSave([createWorld('ABC', 500)]),
        createWorld('ABC', 500),
      ).completedWorlds[0].runId,
    ).toBe('ABC-500');
  });

  it('should leave the other worlds in place when it files a world', () => {
    expect(
      addCompletedWorld(
        createSave([createWorld('XYZ', 50)]),
        createWorld('ABC', 500),
      ).completedWorlds,
    ).toEqual([createWorld('XYZ', 50), createWorld('ABC', 500)]);
  });

  it('should take the score of the run when it files a world', () => {
    expect(
      addCompletedWorld(
        createSave([createWorld('ABC', 500)]),
        createWorld('ABC', 100),
      ).score,
    ).toBe(100);
  });

  it('should not change the old save when it files a world', () => {
    const save = createSave([createWorld('ABC', 500)]);

    addCompletedWorld(save, createWorld('ABC', 900));

    expect(save).toEqual(createSave([createWorld('ABC', 500)]));
  });
});
