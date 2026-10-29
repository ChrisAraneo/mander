import {
  type Action,
  createInitialState,
  createRecorder,
  type GameLevel,
  type GameState,
  serializeReplay,
  toReplay,
} from '@mander/engine';
import { type Tile, TILE_AIR } from '@mander/model';
import type { RenderedWorld } from '@mander/render';
import { constant, times } from 'lodash-es';
import { NEVER, Subject, type Subscription } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { ref, shallowRef } from 'vue';

import { createCanvasCell } from '../../canvas';
import type { Keyboard } from '../../input';
import { readSave } from '../../storage';
import { createReplaySession } from '../../use-replay';
import type { Game } from '../types/game';
import { writeGameRun } from './write-game-run';

const LEVEL: GameLevel = {
  seed: 'RUN',
  width: 4,
  height: 4,
  tiles: times(4, (): Tile[] => times(4, constant(TILE_AIR))),
  chestItems: [],
  hornedEnemyChance: 0,
  fastEnemyChance: 0,
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

describe('writeGameRun', () => {
  it('should file the run with its world, day, score and recording when it ended in death', () => {
    const storage = createStorage(new Map());
    const game = createGameFixture(storage);

    writeGameRun(
      game,
      createState({ status: 'GAME_OVER', time: 12, score: 40 }),
      'GAME_OVER',
    );

    expect(readSave(storage).runs).toEqual([
      expect.objectContaining({
        name: 'ABC',
        day: '2026-09-04',
        outcome: 'GAME_OVER',
        score: 40,
        seconds: 12,
        levelIndex: 0,
        replay: serializeReplay(toReplay(game.recorder.value)),
      }),
    ]);
  });

  it('should give back true when it files the run', () => {
    expect(
      writeGameRun(
        createGameFixture(createStorage(new Map())),
        createState({ status: 'GAME_OVER', time: 12 }),
        'GAME_OVER',
      ),
    ).toBe(true);
  });

  it('should mark the run as saved when it files the run', () => {
    const game = createGameFixture(createStorage(new Map()));

    writeGameRun(game, createState({ time: 30 }), 'ABANDONED');

    expect(game.isRunSaved.value).toBe(true);
  });

  it('should file nothing when the player left right after starting', () => {
    const storage = createStorage(new Map());

    const isWritten = writeGameRun(
      createGameFixture(storage),
      createState({ time: 0 }),
      'ABANDONED',
    );

    expect(isWritten).toBe(false);
    expect(readSave(storage).runs).toEqual([]);
  });

  it('should file nothing when the run was already saved', () => {
    const storage = createStorage(new Map());
    const game = createGameFixture(storage);
    game.isRunSaved.value = true;

    const isWritten = writeGameRun(
      game,
      createState({ status: 'GAME_OVER', time: 12 }),
      'GAME_OVER',
    );

    expect(isWritten).toBe(false);
    expect(readSave(storage).runs).toEqual([]);
  });
});
