import { describe, expect, it } from 'vitest';

import { readSave } from './read-save';

const createStorage = (store: Map<string, string>): Storage =>
  ({
    getItem: (key: string): string | null => store.get(key) ?? null,
  }) as unknown as Storage;

const EMPTY_SAVE = {
  score: 0,
  completedWorlds: [],
  playedWorlds: [],
  runs: [],
};

describe('readSave', () => {
  it('should read the save from the key the game has always used', () => {
    const storage = createStorage(
      new Map([['MANDER:SAVE:V2', JSON.stringify({ score: 7 })]]),
    );

    expect(readSave(storage).score).toBe(7);
  });

  it('should start an empty save when nothing has been stored yet', () => {
    expect(readSave(createStorage(new Map()))).toEqual(EMPTY_SAVE);
  });

  it('should come back with no runs when the save was written before runs were archived', () => {
    const storage = createStorage(
      new Map([['MANDER:SAVE:V2', JSON.stringify({ score: 7 })]]),
    );

    expect(readSave(storage).runs).toEqual([]);
    expect(readSave(storage).playedWorlds).toEqual([]);
  });

  it('should start an empty save when the stored save is broken', () => {
    const storage = createStorage(new Map([['MANDER:SAVE:V2', '{broken']]));

    expect(readSave(storage)).toEqual(EMPTY_SAVE);
  });

  it('should start an empty save when the storage fails to answer', () => {
    expect(readSave({} as unknown as Storage)).toEqual(EMPTY_SAVE);
  });

  it('should start an empty save when there is no storage at all', () => {
    expect(readSave(undefined)).toEqual(EMPTY_SAVE);
  });
});
