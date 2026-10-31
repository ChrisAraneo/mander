import {
  type Action,
  addRecordedAction,
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
import { startNewRun } from './start-new-run';

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

describe('startNewRun', () => {
  it('should start a fresh recording of the same world when a new run starts', () => {
    const game = createGameFixture(createStorage(new Map()));
    game.recorder.value = addRecordedAction(game.recorder.value, {
      type: 'TICK',
    });

    startNewRun(game);

    expect(game.recorder.value).toEqual(createRecorder('ABC'));
  });

  it('should mark the new run as not saved when a new run starts', () => {
    const game = createGameFixture(createStorage(new Map()));
    game.isRunSaved.value = true;

    expect(startNewRun(game)).toBe(false);
    expect(game.isRunSaved.value).toBe(false);
  });

  it('should file the old run as left when it lasted long enough', () => {
    const storage = createStorage(new Map());
    const game = createGameFixture(storage);
    game.state.value = createState({ time: 30 });

    startNewRun(game);

    expect(map(readSave(storage).runs, (run) => run.outcome)).toEqual([
      'ABANDONED',
    ]);
  });

  it('should file nothing when the old run was too short', () => {
    const storage = createStorage(new Map());

    startNewRun(createGameFixture(storage));

    expect(readSave(storage).runs).toEqual([]);
  });
});
