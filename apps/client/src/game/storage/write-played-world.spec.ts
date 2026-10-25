import { padStart, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { PLAYED_WORLDS_KEPT, STORAGE_KEY } from './consts';
import { readSave } from './read-save';
import { writePlayedWorld } from './write-played-world';

const formatPlayedAt = (seconds: number): string =>
  `2026-08-16T10:00:${padStart(String(seconds), 2, '0')}Z`;

const createStorage = (store: Map<string, string>): Storage =>
  ({
    getItem: (key: string): string | null => store.get(key) ?? null,
    setItem: (key: string, value: string): Map<string, string> =>
      store.set(key, value),
    removeItem: (key: string): boolean => store.delete(key),
  }) as unknown as Storage;

describe('writePlayedWorld', () => {
  it('should remember the world when it is played for the first time', () => {
    const storage = createStorage(new Map());

    writePlayedWorld(
      { name: 'ABC', day: '2026-08-16' },
      formatPlayedAt(0),
      storage,
    );

    expect(readSave(storage).playedWorlds).toEqual([
      { name: 'ABC', day: '2026-08-16', playedAt: formatPlayedAt(0), runs: 1 },
    ]);
  });

  it('should count a second run rather than list the world twice when the same world is played again', () => {
    const storage = createStorage(new Map());

    writePlayedWorld(
      { name: 'ABC', day: '2026-08-16' },
      formatPlayedAt(0),
      storage,
    );
    writePlayedWorld(
      { name: 'ABC', day: '2026-08-16' },
      formatPlayedAt(5),
      storage,
    );

    const { playedWorlds } = readSave(storage);
    expect(playedWorlds).toHaveLength(1);
    expect(playedWorlds[0].runs).toBe(2);
    expect(playedWorlds[0].playedAt, 'and remembers the latest visit').toBe(
      formatPlayedAt(5),
    );
  });

  it('should move the world to the end of the shelf when it is played again', () => {
    const storage = createStorage(new Map());

    writePlayedWorld(
      { name: 'ABC', day: '2026-08-16' },
      formatPlayedAt(0),
      storage,
    );
    writePlayedWorld(
      { name: 'XYZ', day: '2026-08-17' },
      formatPlayedAt(1),
      storage,
    );
    writePlayedWorld(
      { name: 'ABC', day: '2026-08-16' },
      formatPlayedAt(2),
      storage,
    );

    expect(readSave(storage).playedWorlds[1].name).toBe('ABC');
  });

  it('should let go of the oldest worlds when the shelf is full', () => {
    const storage = createStorage(new Map());

    times(PLAYED_WORLDS_KEPT + 10, (index) =>
      writePlayedWorld(
        { name: `W${index}`, day: '2026-08-16' },
        formatPlayedAt(index),
        storage,
      ),
    );

    const { playedWorlds } = readSave(storage);
    expect(playedWorlds).toHaveLength(PLAYED_WORLDS_KEPT);
    expect(playedWorlds[0].name, 'the first ten dropped off').toBe('W10');
  });

  it('should keep the rest of the save when it records a world', () => {
    const storage = createStorage(
      new Map([[STORAGE_KEY, JSON.stringify({ score: 7 })]]),
    );

    writePlayedWorld(
      { name: 'ABC', day: '2026-08-16' },
      formatPlayedAt(0),
      storage,
    );

    expect(readSave(storage).score).toBe(7);
  });
});
