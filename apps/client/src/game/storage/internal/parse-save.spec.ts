import { describe, expect, it } from 'vitest';

import { parseSave } from './parse-save';

const EMPTY_SAVE = {
  score: 0,
  completedWorlds: [],
  playedWorlds: [],
  runs: [],
};

describe('parseSave', () => {
  it('should read each part of the save when it was stored whole', () => {
    const save = {
      score: 7,
      completedWorlds: [
        {
          name: 'ABC',
          day: '2026-09-04',
          score: 7,
          seconds: 30,
          runId: '',
          replay: null,
        },
      ],
      playedWorlds: [{ name: 'ABC', day: '2026-09-04', playedAt: '', runs: 1 }],
      runs: [],
    };

    expect(parseSave(JSON.stringify(save))).toEqual(save);
  });

  it('should come back with empty lists when the save was written before they were kept', () => {
    expect(parseSave(JSON.stringify({ score: 7 }))).toEqual({
      ...EMPTY_SAVE,
      score: 7,
    });
  });

  it('should start an empty save when nothing was stored', () => {
    expect(parseSave(null)).toEqual(EMPTY_SAVE);
  });

  it('should start an empty save when the stored text is not valid', () => {
    expect(parseSave('{broken')).toEqual(EMPTY_SAVE);
  });

  it('should start an empty save when the stored value is not an object', () => {
    expect(parseSave('42')).toEqual(EMPTY_SAVE);
  });
});
