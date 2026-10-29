import {
  type Action,
  createInitialState,
  createRecorder,
  type GameLevel,
} from '@mander/engine';
import { type Tile, TILE_AIR } from '@mander/model';
import type { RenderedWorld } from '@mander/render';
import { assign, constant, map, pick, times } from 'lodash-es';
import { NEVER, Subject, type Subscription } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { ref, shallowRef } from 'vue';

import { createCanvasCell } from '../../canvas';
import type { Keyboard } from '../../input';
import { readSave } from '../../storage';
import type { AnimationFrame } from '../../tick';
import { createReplaySession } from '../../use-replay';
import type { Game } from '../types/game';
import { closeGame } from './close-game';
import { startGame } from './start-game';

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

const CONTEXT = { kind: 'CONTEXT' } as unknown as CanvasRenderingContext2D;

const CANVAS = {
  getContext: (): CanvasRenderingContext2D => CONTEXT,
} as unknown as HTMLCanvasElement;

const createStorage = (store: Map<string, string>): Storage =>
  ({
    getItem: (key: string): string | null => store.get(key) ?? null,
    setItem: (key: string, value: string): Map<string, string> =>
      store.set(key, value),
  }) as unknown as Storage;

const createPage = (): Window => new EventTarget() as unknown as Window;

const createKeyEvent = (type: string, code: string): Event =>
  assign(new Event(type, { cancelable: true }), { code, repeat: false });

const createGameFixture = (
  storage: Storage | undefined,
  canvas: HTMLCanvasElement | null,
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
      cell: createCanvasCell(ref(canvas)),
      palette: WORLD.palette,
      levels: WORLD.levels,
      score: WORLD.score,
      rivals: [],
      frames: NEVER,
    },
  ),
});

describe('startGame', () => {
  it('should store the world score and mark the world as played when it starts', () => {
    const storage = createStorage(new Map());
    const game = createGameFixture(storage, CANVAS);

    startGame(game, new Subject<AnimationFrame>(), createPage());
    closeGame(game);

    expect(readSave(storage).score).toBe(70);
    expect(
      map(readSave(storage).playedWorlds, (world) =>
        pick(world, ['name', 'day', 'runs']),
      ),
    ).toEqual([{ name: 'ABC', day: '2026-09-04', runs: 1 }]);
  });

  it('should keep the keyboard and the playing when it starts', () => {
    const game = createGameFixture(createStorage(new Map()), CANVAS);

    const subscription = startGame(
      game,
      new Subject<AnimationFrame>(),
      createPage(),
    );
    const keyboard = game.keyboard.value;
    closeGame(game);

    expect(subscription).not.toBeNull();
    expect(game.subscription.value).toBe(subscription);
    expect(keyboard).not.toBeNull();
  });

  it('should move the player when a key is pressed on the page', () => {
    const game = createGameFixture(createStorage(new Map()), CANVAS);
    const page = createPage();
    startGame(game, new Subject<AnimationFrame>(), page);

    page.dispatchEvent(createKeyEvent('keydown', 'KeyD'));
    closeGame(game);

    expect(game.state.value.input.isRight).toBe(true);
  });

  it('should start nothing when the canvas is not mounted', () => {
    const storage = createStorage(new Map());
    const game = createGameFixture(storage, null);

    const subscription = startGame(
      game,
      new Subject<AnimationFrame>(),
      createPage(),
    );

    expect(subscription).toBeNull();
    expect(game.subscription.value).toBeNull();
    expect(game.keyboard.value).toBeNull();
    expect(readSave(storage).playedWorlds).toEqual([]);
  });
});
