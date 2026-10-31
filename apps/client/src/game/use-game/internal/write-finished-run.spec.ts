import {
  type Action,
  createInitialState,
  createRecorder,
  type GameLevel,
} from '@mander/engine';
import { type Tile, TILE_AIR } from '@mander/model';
import type { RenderedWorld } from '@mander/render';
import { constant, map, omit, times } from 'lodash-es';
import { NEVER, Subject, type Subscription } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { ref, shallowRef } from 'vue';

import { createCanvasCell } from '../../canvas';
import type { Keyboard } from '../../input';
import { type FinishedRun, readSave } from '../../storage';
import { createReplaySession } from '../../use-replay';
import type { Game } from '../types/game';
import { writeFinishedRun } from './write-finished-run';

const LEVEL: GameLevel = {
  seed: 'RUN',
  width: 4,
  height: 4,
  tiles: times(4, (): Tile[] => times(4, constant(TILE_AIR))),
  chestItems: [],
  hornedEnemyChance: 0,
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
};

const WORLD = {
  name: 'ABC',
  levels: [LEVEL, LEVEL],
  score: 70,
  palette: {},
} as unknown as RenderedWorld;

const RUN: FinishedRun = {
  name: 'ABC',
  day: '2026-09-04',
  outcome: 'GAME_OVER',
  score: 120,
  seconds: 45,
  levelIndex: 1,
  replay: { worldName: 'ABC', steps: 1, entries: [[0, 0]] },
};

const createStorage = (store: Map<string, string>): Storage =>
  ({
    getItem: (key: string): string | null => store.get(key) ?? null,
    setItem: (key: string, value: string): Map<string, string> =>
      store.set(key, value),
  }) as unknown as Storage;

const createGameFixture = (
  storage: Storage | undefined,
  state = shallowRef(createInitialState(LEVEL, 0, [])),
  recorder = shallowRef(createRecorder('ABC')),
): Game => ({
  world: WORLD,
  day: '2026-09-04',
  storage,
  state,
  frame: shallowRef({ previous: state.value, current: state.value }),
  actions: new Subject<Action>(),
  recorder,
  isRunSaved: shallowRef(false),
  keyboard: shallowRef<Keyboard | null>(null),
  subscription: shallowRef<Subscription | null>(null),
  replay: createReplaySession(
    { kind: 'GAME', recorder, state },
    {
      cell: createCanvasCell(ref(null)),
      palette: WORLD.palette,
      levels: WORLD.levels,
      score: WORLD.score,
      rivals: [],
      frames: NEVER,
    },
  ),
});

describe('writeFinishedRun', () => {
  it('should file the run in the save when it writes the run', () => {
    const storage = createStorage(new Map());

    writeFinishedRun(createGameFixture(storage), RUN);

    expect(
      map(readSave(storage).runs, (run) => omit(run, ['id', 'playedAt'])),
    ).toEqual([RUN]);
  });

  it('should mark the run as saved when it writes the run', () => {
    const game = createGameFixture(createStorage(new Map()));

    writeFinishedRun(game, RUN);

    expect(game.isRunSaved.value).toBe(true);
  });

  it('should give back true when the save was written', () => {
    expect(
      writeFinishedRun(createGameFixture(createStorage(new Map())), RUN),
    ).toBe(true);
  });

  it('should give back false when there is no storage', () => {
    expect(writeFinishedRun(createGameFixture(undefined), RUN)).toBe(false);
  });

  it('should still mark the run as saved when there is no storage', () => {
    const game = createGameFixture(undefined);

    writeFinishedRun(game, RUN);

    expect(game.isRunSaved.value).toBe(true);
  });
});
