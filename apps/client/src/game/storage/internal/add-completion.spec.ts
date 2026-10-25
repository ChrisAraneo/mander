import { describe, expect, it } from 'vitest';

import type { RunRecord } from '../types/run-record';
import type { SaveData } from '../types/save-data';
import { addCompletion } from './add-completion';

const REPLAY = { worldName: 'ABC', steps: 1, entries: [[0, 0]] };

const createRecord = (patch: Partial<RunRecord> = {}): RunRecord => ({
  id: 'RUN-1',
  name: 'ABC',
  day: '2026-09-04',
  playedAt: 'NOW',
  outcome: 'COMPLETE',
  score: 900,
  seconds: 61,
  levelIndex: 0,
  replay: REPLAY,
  ...patch,
});

const createSave = (): SaveData => ({
  score: 0,
  completedWorlds: [],
  playedWorlds: [],
  runs: [],
});

describe('addCompletion', () => {
  it('should file a world record when the run was finished', () => {
    expect(addCompletion(createSave(), createRecord()).completedWorlds).toEqual(
      [
        {
          name: 'ABC',
          day: '2026-09-04',
          score: 900,
          seconds: 61,
          runId: 'RUN-1',
          replay: REPLAY,
        },
      ],
    );
  });

  it('should give back the same save when the run ended in death', () => {
    const save = createSave();

    expect(addCompletion(save, createRecord({ outcome: 'GAME_OVER' }))).toBe(
      save,
    );
  });

  it('should give back the same save when the run was left unfinished', () => {
    const save = createSave();

    expect(addCompletion(save, createRecord({ outcome: 'ABANDONED' }))).toBe(
      save,
    );
  });

  it('should not change the old save when it files a world record', () => {
    const save = createSave();

    addCompletion(save, createRecord());

    expect(save).toEqual(createSave());
  });
});
