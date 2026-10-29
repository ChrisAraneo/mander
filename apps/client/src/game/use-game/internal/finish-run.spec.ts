import {
  type Action,
  createInitialState,
  createRecorder,
  type GameLevel,
  type GameState,
} from '@mander/engine';
import { type Tile, TILE_AIR } from '@mander/model';
import type { RenderedWorld } from '@mander/render';
import { constant, map, times } from 'lodash-es';
import { NEVER, Subject, type Subscription } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { ref, shallowRef } from 'vue';

import { createCanvasCell } from '../../canvas';
import type { Keyboard } from '../../input';
import { readSave } from '../../storage';
import { createReplaySession } from '../../use-replay';
import type { Game } from '../types/game';
import { finishRun } from './finish-run';

const LEVEL: GameLevel = {
  seed: 'RUN',
  width: 4,
  height: 4,
  tiles: times(4, (): Tile[] => times(4, constant(TILE_AIR))),
  chestItems: [],
  hornedEnemyChance: 0,
  shooterEnemyChance: 0,
};

const WORLD = {
  name: 'ABC',
  levels: [LEVEL, LEVEL],
  score: 70,
  palette: {},
} as unknown as RenderedWorld;

const createStorage = (store: Map<string, string>): Storage =>
  ({
    getItem: (key: string): string | null => store.get(key) ?? null,
    setItem: (key: string, value: string): Map<string, string> =>
      store.set(key, value),
  }) as unknown as Storage;

const createState = (patch: Partial<GameState> = {}): GameState => ({
  ...createInitialState(LEVEL, 0, []),
  ...patch,
});

const createGameFixture = (
  storage: Storage | undefined,
  state = shallowRef(createState()),
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

describe('finishRun', () => {
  it('should stop the recording when the player dies', () => {
    const game = createGameFixture(createStorage(new Map()));

    finishRun(game, createState({ status: 'GAME_OVER', time: 5 }));

    expect(game.recorder.value.isRecording).toBe(false);
  });

  it('should file the run as a death when the player dies', () => {
    const storage = createStorage(new Map());

    const isWritten = finishRun(
      createGameFixture(storage),
      createState({ status: 'GAME_OVER', time: 5 }),
    );

    expect(isWritten).toBe(true);
    expect(map(readSave(storage).runs, (run) => run.outcome)).toEqual([
      'GAME_OVER',
    ]);
  });

  it('should file the run as finished when the last level is finished', () => {
    const storage = createStorage(new Map());

    finishRun(
      createGameFixture(storage),
      createState({ status: 'COMPLETE', levelIndex: 1, levelTimes: [5, 6] }),
    );

    expect(map(readSave(storage).runs, (run) => run.outcome)).toEqual([
      'COMPLETE',
    ]);
  });

  it('should keep recording and file nothing when the run goes on', () => {
    const storage = createStorage(new Map());
    const game = createGameFixture(storage);

    const isWritten = finishRun(game, createState({ time: 5 }));

    expect(isWritten).toBe(false);
    expect(game.recorder.value.isRecording).toBe(true);
    expect(readSave(storage).runs).toEqual([]);
  });

  it('should keep recording when a level before the last one is finished', () => {
    const game = createGameFixture(createStorage(new Map()));

    finishRun(game, createState({ status: 'COMPLETE', levelIndex: 0 }));

    expect(game.recorder.value.isRecording).toBe(true);
  });
});
