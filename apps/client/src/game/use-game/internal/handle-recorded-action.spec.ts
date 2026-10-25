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
import { handleRecordedAction } from './handle-recorded-action';

const LEVEL: GameLevel = {
  seed: 'RUN',
  width: 4,
  height: 4,
  tiles: times(4, (): Tile[] => times(4, constant(TILE_AIR))),
  chestItems: [],
  hornedEnemyChance: 0,
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

describe('handleRecordedAction', () => {
  it('should record the action when the player presses a key', () => {
    const game = createGameFixture(createStorage(new Map()));

    handleRecordedAction(game, { type: 'MOVE_RIGHT_START' });

    expect(game.recorder.value.entries).toEqual([
      { atStep: 0, action: { type: 'MOVE_RIGHT_START' } },
    ]);
  });

  it('should count the step when the game ticks', () => {
    const game = createGameFixture(createStorage(new Map()));

    handleRecordedAction(game, { type: 'TICK' });

    expect(game.recorder.value.step).toBe(1);
  });

  it('should give back the new recording when it records the action', () => {
    const game = createGameFixture(createStorage(new Map()));

    expect(handleRecordedAction(game, { type: 'TICK' })).toBe(
      game.recorder.value,
    );
  });

  it('should file the old run and record into a fresh recording when the run restarts', () => {
    const storage = createStorage(new Map());
    const game = createGameFixture(storage);
    game.state.value = createState({ time: 30 });
    handleRecordedAction(game, { type: 'TICK' });

    handleRecordedAction(game, { type: 'RESTART', level: LEVEL });

    expect(map(readSave(storage).runs, (run) => run.outcome)).toEqual([
      'ABANDONED',
    ]);
    expect(game.recorder.value.step).toBe(0);
    expect(game.recorder.value.entries).toEqual([
      { atStep: 0, action: { type: 'RESTART', level: LEVEL } },
    ]);
  });

  it('should file nothing when the action does not restart the run', () => {
    const storage = createStorage(new Map());
    const game = createGameFixture(storage);
    game.state.value = createState({ time: 30 });

    handleRecordedAction(game, { type: 'MOVE_RIGHT_START' });

    expect(readSave(storage).runs).toEqual([]);
  });
});
