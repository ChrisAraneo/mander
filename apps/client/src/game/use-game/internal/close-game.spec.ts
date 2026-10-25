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
import { NEVER, Subject, Subscription } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { ref, shallowRef } from 'vue';

import { createCanvasCell } from '../../canvas';
import type { Keyboard } from '../../input';
import { readSave } from '../../storage';
import { createReplaySession } from '../../use-replay';
import type { Game } from '../types/game';
import { closeGame } from './close-game';

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

const CONTEXT = { kind: 'CONTEXT' } as unknown as CanvasRenderingContext2D;

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

const createKeyboardFixture = (): Keyboard => ({
  actions: new Subject<Action>(),
  subscription: new Subscription(),
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

describe('closeGame', () => {
  it('should let go of the drawing context when the game closes', () => {
    const game = createGameFixture(createStorage(new Map()));
    game.replay.stage.cell.context.value = CONTEXT;

    const context = closeGame(game);

    expect(context).toBeNull();
    expect(game.replay.stage.cell.context.value).toBeNull();
  });

  it('should stop the playing when the game closes', () => {
    const game = createGameFixture(createStorage(new Map()));
    const playing = new Subscription();
    game.subscription.value = playing;

    closeGame(game);

    expect(playing.closed).toBe(true);
  });

  it('should close the keyboard when the game has one', () => {
    const game = createGameFixture(createStorage(new Map()));
    const keyboard = createKeyboardFixture();
    const finished: boolean[] = [];
    keyboard.actions.subscribe({ complete: () => finished.push(true) });
    game.keyboard.value = keyboard;

    closeGame(game);

    expect(keyboard.subscription.closed).toBe(true);
    expect(finished).toEqual([true]);
  });

  it('should close quietly when the game never started', () => {
    expect(closeGame(createGameFixture(createStorage(new Map())))).toBeNull();
  });

  it('should file the run as left when it lasted long enough', () => {
    const storage = createStorage(new Map());
    const game = createGameFixture(storage);
    game.state.value = createState({ time: 30 });

    closeGame(game);

    expect(map(readSave(storage).runs, (run) => run.outcome)).toEqual([
      'ABANDONED',
    ]);
  });

  it('should file nothing when the run was too short', () => {
    const storage = createStorage(new Map());

    closeGame(createGameFixture(storage));

    expect(readSave(storage).runs).toEqual([]);
  });
});
