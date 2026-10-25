import { describe, expect, it } from 'vitest';

import { STORAGE_KEY } from '../consts';
import type { SaveData } from '../types/save-data';
import { tryWriteSave } from './try-write-save';

const SAVE: SaveData = {
  score: 7,
  completedWorlds: [],
  playedWorlds: [],
  runs: [],
};

const createStorage = (store: Map<string, string>): Storage =>
  ({
    setItem: (key: string, value: string): Map<string, string> =>
      store.set(key, value),
  }) as unknown as Storage;

const createFullStorage = (): Storage =>
  ({
    setItem: (): void => new Uint8Array(0).set([0]),
  }) as unknown as Storage;

describe('tryWriteSave', () => {
  it('should store the save as JSON when the storage takes it', () => {
    const store = new Map<string, string>();

    const isWritten = tryWriteSave(SAVE, createStorage(store));

    expect(isWritten).toBe(true);
    expect(store.get(STORAGE_KEY)).toBe(JSON.stringify(SAVE));
  });

  it('should report a failure when the storage is full', () => {
    expect(tryWriteSave(SAVE, createFullStorage())).toBe(false);
  });

  it('should report a failure when there is no storage', () => {
    expect(tryWriteSave(SAVE, undefined)).toBe(false);
  });
});
