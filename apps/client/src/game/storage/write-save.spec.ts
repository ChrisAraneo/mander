import type { PackedReplay } from '@mander/engine';
import { constant, last, padStart, size, tap, times } from 'lodash-es';
import { pipe } from 'remeda';
import { describe, expect, it } from 'vitest';

import { STORAGE_KEY } from './consts';
import { readSave } from './read-save';
import type { RunRecord } from './types/run-record';
import type { SaveData } from './types/save-data';
import { writeSave } from './write-save';

const formatPlayedAt = (minute: number): string =>
  `2026-09-04T10:${padStart(String(minute), 2, '0')}:00Z`;

const createReplay = (length: number): PackedReplay => ({
  worldName: 'ABC',
  steps: length * 4,
  entries: times(length, (index) => [index * 4, 0]),
});

const createRun = (index: number): RunRecord => ({
  id: `RUN-${index}`,
  name: 'ABC',
  day: '2026-09-04',
  playedAt: formatPlayedAt(index),
  outcome: 'GAME_OVER',
  score: 120,
  seconds: 45,
  levelIndex: 2,
  replay: createReplay(200),
});

const SAVE: SaveData = {
  score: 7,
  completedWorlds: [],
  playedWorlds: [
    { name: 'ABC', day: '2026-09-04', playedAt: formatPlayedAt(0), runs: 1 },
  ],
  runs: times(6, createRun),
};

const createStorage = (store: Map<string, string>): Storage =>
  ({
    getItem: (key: string): string | null => store.get(key) ?? null,
    setItem: (key: string, value: string): Map<string, string> =>
      store.set(key, value),
  }) as unknown as Storage;

const writeIntoRoom = (
  store: Map<string, string>,
  room: number,
  key: string,
  value: string,
): Map<string, string> =>
  pipe(
    new Uint8Array(room),
    (buffer) => tap(buffer, () => buffer.set(times(size(value), constant(0)))),
    () => store.set(key, value),
  );

const createFullStorage = (store: Map<string, string>, room: number): Storage =>
  ({
    getItem: (key: string): string | null => store.get(key) ?? null,
    setItem: (key: string, value: string): Map<string, string> =>
      writeIntoRoom(store, room, key, value),
  }) as unknown as Storage;

describe('writeSave', () => {
  it('should store the whole save when there is room for it', () => {
    const storage = createStorage(new Map());

    writeSave(SAVE, storage);

    expect(readSave(storage)).toEqual(SAVE);
  });

  it('should store the save under the key the game has always used', () => {
    const store = new Map<string, string>();

    writeSave(SAVE, createStorage(store));

    expect(store.get(STORAGE_KEY)).toBe(JSON.stringify(SAVE));
  });

  it('should say it stored the save when there is room for it', () => {
    expect(writeSave(SAVE, createStorage(new Map()))).toBe(true);
  });

  it('should shed the oldest replays rather than lose the save when there is no room left', () => {
    const storage = createFullStorage(new Map(), 9_000);

    writeSave(SAVE, storage);

    const { playedWorlds, runs } = readSave(storage);
    expect(size(runs), 'only what fits is kept').toBeLessThan(6);
    expect(size(runs), 'and the newest still is').toBeGreaterThan(0);
    expect(last(runs)?.id, 'the newest at the end').toBe('RUN-5');
    expect(playedWorlds, 'while the rest of the save survives').toEqual(
      SAVE.playedWorlds,
    );
  });

  it('should say nothing was stored when there is no storage at all', () => {
    expect(writeSave(SAVE, undefined)).toBe(false);
  });

  it('should say nothing was stored when even the smallest save does not fit', () => {
    const store = new Map<string, string>();

    expect(writeSave(SAVE, createFullStorage(store, 10))).toBe(false);
    expect(size(store)).toBe(0);
  });
});
