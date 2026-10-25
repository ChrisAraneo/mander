import { describe, expect, it } from 'vitest';

import { toSaveData } from './to-save-data';

const REPLAY = { worldName: 'ABC', steps: 1, entries: [[0, 1]] };

const SAVE = {
  score: 7,
  completedWorlds: [
    {
      name: 'ABC',
      day: '2026-09-04',
      score: 900,
      seconds: 61,
      runId: 'RUN-1',
      replay: REPLAY,
    },
  ],
  playedWorlds: [{ name: 'ABC', day: '2026-09-04', playedAt: 'NOW', runs: 2 }],
  runs: [
    {
      id: 'RUN-1',
      name: 'ABC',
      day: '2026-09-04',
      playedAt: 'NOW',
      outcome: 'COMPLETE',
      score: 900,
      seconds: 61,
      levelIndex: 0,
      replay: REPLAY,
    },
  ],
};

const EMPTY_SAVE = {
  score: 0,
  completedWorlds: [],
  playedWorlds: [],
  runs: [],
};

describe('toSaveData', () => {
  it('should read every part when the save was stored whole', () => {
    expect(toSaveData(SAVE)).toEqual(SAVE);
  });

  it('should fill in empty parts when the save was stored as an empty record', () => {
    expect(toSaveData({})).toEqual(EMPTY_SAVE);
  });

  it('should give an empty save when the value is not a record', () => {
    expect(toSaveData('save')).toEqual(EMPTY_SAVE);
  });

  it('should give an empty save when there is no value', () => {
    expect(toSaveData(undefined)).toEqual(EMPTY_SAVE);
  });
});
