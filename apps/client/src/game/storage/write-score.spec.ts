import { describe, expect, it } from 'vitest';

import { STORAGE_KEY } from './consts';
import { readSave } from './read-save';
import { writeScore } from './write-score';

const createStorage = (store: Map<string, string>): Storage =>
  ({
    getItem: (key: string): string | null => store.get(key) ?? null,
    setItem: (key: string, value: string): Map<string, string> =>
      store.set(key, value),
  }) as unknown as Storage;

describe('writeScore', () => {
  it('should store the score when it is written', () => {
    const storage = createStorage(new Map());

    writeScore(450, storage);

    expect(readSave(storage).score).toBe(450);
  });

  it('should keep the rest of the save when it writes the score', () => {
    const storage = createStorage(
      new Map([
        [
          STORAGE_KEY,
          JSON.stringify({
            score: 7,
            playedWorlds: [
              { name: 'ABC', day: '2026-09-04', playedAt: '', runs: 3 },
            ],
          }),
        ],
      ]),
    );

    writeScore(450, storage);

    expect(readSave(storage).playedWorlds).toEqual([
      { name: 'ABC', day: '2026-09-04', playedAt: '', runs: 3 },
    ]);
  });
});
