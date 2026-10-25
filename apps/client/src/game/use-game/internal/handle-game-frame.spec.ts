import {
  type Action,
  createInitialState,
  createRecorder,
  type GameLevel,
  type GameState,
} from '@mander/engine';
import { type Tile, TILE_AIR } from '@mander/model';
import type { RenderedWorld } from '@mander/render';
import { constant, get, map, times } from 'lodash-es';
import { NEVER, Subject, type Subscription } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { ref, shallowRef } from 'vue';

import { createCanvasCell } from '../../canvas';
import type { Keyboard } from '../../input';
import { readSave } from '../../storage';
import { createReplaySession } from '../../use-replay';
import type { Game } from '../types/game';
import type { GameFrame } from '../types/game-frame';
import { handleGameFrame } from './handle-game-frame';

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

const createFrame = (current: GameState): GameFrame => ({
  previous: createState(),
  current,
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

describe('handleGameFrame', () => {
  it('should show the new frame and its state when the frame comes', () => {
    const game = createGameFixture(createStorage(new Map()));
    const frame = createFrame(createState({ time: 1 }));

    handleGameFrame(game, frame, {} as unknown as Window);

    expect(game.frame.value).toBe(frame);
    expect(game.state.value).toBe(frame.current);
  });

  it('should put the new state on the page when the frame comes', () => {
    const page = {} as unknown as Window;
    const frame = createFrame(createState({ time: 1 }));

    handleGameFrame(createGameFixture(createStorage(new Map())), frame, page);

    expect(get(page, 'manderState')).toBe(frame.current);
  });

  it('should store the score when a level before the last one is finished', () => {
    const storage = createStorage(new Map());

    const isWritten = handleGameFrame(
      createGameFixture(storage),
      createFrame(createState({ status: 'COMPLETE', score: 90 })),
      {} as unknown as Window,
    );

    expect(isWritten).toBe(false);
    expect(readSave(storage).score).toBe(90);
  });

  it('should file the run when the player dies', () => {
    const storage = createStorage(new Map());

    const isWritten = handleGameFrame(
      createGameFixture(storage),
      createFrame(createState({ status: 'GAME_OVER', time: 5 })),
      {} as unknown as Window,
    );

    expect(isWritten).toBe(true);
    expect(map(readSave(storage).runs, (run) => run.outcome)).toEqual([
      'GAME_OVER',
    ]);
  });

  it('should store and file nothing when the level is still being played', () => {
    const storage = createStorage(new Map());

    const isWritten = handleGameFrame(
      createGameFixture(storage),
      createFrame(createState({ time: 1, score: 90 })),
      {} as unknown as Window,
    );

    expect(isWritten).toBe(false);
    expect(readSave(storage)).toEqual({
      score: 0,
      completedWorlds: [],
      playedWorlds: [],
      runs: [],
    });
  });
});
