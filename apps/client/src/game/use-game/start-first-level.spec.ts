import type { Action, GameLevel } from '@mander/engine';
import { type Tile, TILE_AIR } from '@mander/model';
import { constant, times } from 'lodash-es';
import { Subject } from 'rxjs';
import { describe, expect, it } from 'vitest';

import { readSave } from '../storage';
import { STORAGE_KEY } from '../storage/consts';
import { startFirstLevel } from './start-first-level';
import type { Game } from './types/game';

const LEVEL: GameLevel = {
  seed: 'FIRST',
  width: 4,
  height: 4,
  tiles: times(4, (): Tile[] => times(4, constant(TILE_AIR))),
  chestItems: [],
  hornedEnemyChance: 0,
};

const createStorage = (store: Map<string, string>): Storage =>
  ({
    getItem: (key: string): string | null => store.get(key) ?? null,
    setItem: (key: string, value: string): Map<string, string> =>
      store.set(key, value),
  }) as unknown as Storage;

const createGame = (actions: Subject<Action>, storage: Storage): Game =>
  ({
    world: { levels: [LEVEL] },
    actions,
    storage,
  }) as unknown as Game;

describe('startFirstLevel', () => {
  it('should restart the run from the first level', () => {
    const received: Action[] = [];
    const actions = new Subject<Action>();
    actions.subscribe((action) => received.push(action));

    startFirstLevel(createGame(actions, createStorage(new Map())));

    expect(received).toEqual([{ type: 'RESTART', level: LEVEL }]);
  });

  it('should clear the stored score when it restarts the run', () => {
    const storage = createStorage(
      new Map([[STORAGE_KEY, JSON.stringify({ score: 900 })]]),
    );

    startFirstLevel(createGame(new Subject<Action>(), storage));

    expect(readSave(storage).score).toBe(0);
  });
});
