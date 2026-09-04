import {
  createInitialState,
  type GameLevel,
  type GameState,
  type PackedReplay,
} from '@mander/engine';
import { type Tile, TILE_AIR } from '@mander/model';
import { map, size, times } from 'lodash-es';
import { beforeEach, describe, expect, it } from 'vitest';

import { loadSave } from '../storage';
import { STORAGE_KEY } from '../storage/consts';
import { MIN_ABANDONED_SECONDS } from './consts';
import { createRunArchive, type RunSource } from './run-archive';

const store = new Map<string, string>();

Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem: (key: string): string | null => store.get(key) ?? null,
    setItem: (key: string, value: string): void => void store.set(key, value),
    removeItem: (key: string): void => void store.delete(key),
  },
  configurable: true,
});

const testLevel = (): GameLevel => ({
  seed: 'RUN',
  width: 4,
  height: 4,
  tiles: times(4, (): Tile[] => times(4, (): Tile => TILE_AIR)),
  chestItems: [],
  hornedEnemyChance: 0,
});

const stateWith = (patch: Partial<GameState>): GameState => ({
  ...createInitialState(testLevel(), 0, []),
  ...patch,
});

const replay = (): PackedReplay => ({ worldName: 'ABC', entries: [[0, 1]] });

const source = (): RunSource => ({
  name: 'ABC',
  day: '2026-09-04',
  replay,
});

const archived = (): number => size(loadSave().runs);

describe('createRunArchive', () => {
  beforeEach(() => store.clear());

  it('writes the run once, however often the game calls it over', () => {
    const archive = createRunArchive(source());
    const over = stateWith({ status: 'GAME_OVER', time: 30 });

    archive.keep(over, 'GAME_OVER');
    archive.keep(over, 'GAME_OVER');
    archive.keep(over, 'ABANDONED');

    expect(archived()).toBe(1);
    expect(map(loadSave().runs, 'outcome')).toEqual(['GAME_OVER']);
  });

  it('files a fresh run once the recording has been reset', () => {
    const archive = createRunArchive(source());

    archive.keep(stateWith({ status: 'GAME_OVER', time: 30 }), 'GAME_OVER');
    archive.reset();
    archive.keep(stateWith({ status: 'GAME_OVER', time: 40 }), 'GAME_OVER');

    expect(archived()).toBe(2);
  });

  it('counts the level a death happened on', () => {
    createRunArchive(source()).keep(
      stateWith({ status: 'GAME_OVER', levelTimes: [10, 20], time: 5 }),
      'GAME_OVER',
    );

    expect(loadSave().runs[0].seconds).toBe(35);
  });

  it('does not count the last level twice when the run was finished', () => {
    createRunArchive(source()).keep(
      stateWith({ status: 'COMPLETE', levelTimes: [10, 20], time: 20 }),
      'COMPLETE',
    );

    expect(loadSave().runs[0].seconds).toBe(30);
  });

  it('leaves a run the player barely started out of the archive', () => {
    createRunArchive(source()).keep(
      stateWith({ time: MIN_ABANDONED_SECONDS - 1 }),
      'ABANDONED',
    );

    expect(archived()).toBe(0);
  });

  it('keeps a run the player walked away from mid-world', () => {
    createRunArchive(source()).keep(
      stateWith({ time: MIN_ABANDONED_SECONDS, levelIndex: 3 }),
      'ABANDONED',
    );

    const [kept] = loadSave().runs;
    expect(kept.outcome).toBe('ABANDONED');
    expect(kept.levelIndex, 'and how far it got').toBe(3);
  });

  it('keeps a death however quickly it came', () => {
    createRunArchive(source()).keep(
      stateWith({ status: 'GAME_OVER', time: 1 }),
      'GAME_OVER',
    );

    expect(archived()).toBe(1);
  });
});

describe('the save it writes into', () => {
  beforeEach(() => store.clear());

  it('is left alone when nothing was worth keeping', () => {
    createRunArchive(source()).keep(stateWith({ time: 0 }), 'ABANDONED');

    expect(store.get(STORAGE_KEY)).toBeUndefined();
  });
});
