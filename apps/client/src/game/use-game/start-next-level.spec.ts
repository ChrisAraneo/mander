import {
  type Action,
  createInitialState,
  type GameLevel,
} from '@mander/engine';
import { type Tile, TILE_AIR } from '@mander/model';
import { constant, tap, times } from 'lodash-es';
import { pipe } from 'remeda';
import { Subject } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { shallowRef } from 'vue';

import { startNextLevel } from './start-next-level';
import type { Game } from './types/game';

const createLevel = (seed: string): GameLevel => ({
  seed,
  width: 4,
  height: 4,
  tiles: times(4, (): Tile[] => times(4, constant(TILE_AIR))),
  chestItems: [],
  hornedEnemyChance: 0,
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
});

const LEVELS = [createLevel('FIRST'), createLevel('SECOND')];

const createGame = (levelIndex: number, actions: Subject<Action>): Game =>
  ({
    world: { levels: LEVELS },
    state: shallowRef(createInitialState(LEVELS[levelIndex], levelIndex, [])),
    actions,
  }) as unknown as Game;

const runNextLevel = (levelIndex: number): Action[] =>
  pipe(
    { received: new Array<Action>(), actions: new Subject<Action>() },
    (collected) =>
      tap(collected, () =>
        collected.actions.subscribe((action) =>
          collected.received.push(action),
        ),
      ),
    (collected) =>
      tap(collected, () =>
        startNextLevel(createGame(levelIndex, collected.actions)),
      ),
    ({ received }) => received,
  );

describe('startNextLevel', () => {
  it('should load the level after the one being played', () => {
    expect(runNextLevel(0)).toEqual([
      { type: 'LOAD_LEVEL', level: LEVELS[1], levelIndex: 1 },
    ]);
  });

  it('should load nothing when the last level is being played', () => {
    expect(runNextLevel(1)).toEqual([]);
  });
});
