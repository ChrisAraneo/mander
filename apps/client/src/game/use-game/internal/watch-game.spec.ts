import {
  type Action,
  createInitialState,
  createRecorder,
  type GameLevel,
} from '@mander/engine';
import { type Tile, TILE_AIR } from '@mander/model';
import type { RenderedWorld } from '@mander/render';
import { constant, times } from 'lodash-es';
import { NEVER, Subject, Subscription } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { ref, shallowRef } from 'vue';

import { createCanvasCell } from '../../canvas';
import type { Keyboard } from '../../input';
import type { Pulse } from '../../tick';
import { createReplaySession } from '../../use-replay';
import type { Game } from '../types/game';
import { watchGame } from './watch-game';

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

const PAGE = {} as unknown as Window;

const createKeyboardFixture = (): Keyboard => ({
  actions: new Subject<Action>(),
  subscription: new Subscription(),
});

const createGameFixture = (
  state = shallowRef(createInitialState(LEVEL, 0, [])),
  recorder = shallowRef(createRecorder('ABC')),
): Game => ({
  world: WORLD,
  day: '2026-09-04',
  storage: undefined,
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

describe('watchGame', () => {
  it('should step the game and count the steps when a pulse brings ticks', () => {
    const game = createGameFixture();
    const start = game.state.value;
    const pulses = new Subject<Pulse>();
    const subscription = watchGame(game, createKeyboardFixture(), pulses, PAGE);

    pulses.next({ steps: 2, alpha: 0 });
    subscription.unsubscribe();

    expect(game.recorder.value.step).toBe(2);
    expect(game.state.value.time).toBeGreaterThan(start.time);
  });

  it('should record and play the key when the player presses it', () => {
    const game = createGameFixture();
    const keyboard = createKeyboardFixture();
    const subscription = watchGame(game, keyboard, new Subject<Pulse>(), PAGE);

    keyboard.actions.next({ type: 'MOVE_RIGHT_START' });
    subscription.unsubscribe();

    expect(game.state.value.input.isRight).toBe(true);
    expect(game.recorder.value.entries).toEqual([
      { atStep: 0, action: { type: 'MOVE_RIGHT_START' } },
    ]);
  });

  it('should play the action when it is sent to the game', () => {
    const game = createGameFixture();
    const subscription = watchGame(
      game,
      createKeyboardFixture(),
      new Subject<Pulse>(),
      PAGE,
    );

    game.actions.next({ type: 'MOVE_RIGHT_START' });
    subscription.unsubscribe();

    expect(game.state.value.input.isRight).toBe(true);
  });

  it('should stop playing when the watch is closed', () => {
    const game = createGameFixture();
    const start = game.state.value;
    const pulses = new Subject<Pulse>();
    const subscription = watchGame(game, createKeyboardFixture(), pulses, PAGE);

    subscription.unsubscribe();
    pulses.next({ steps: 2, alpha: 0 });

    expect(game.state.value).toBe(start);
    expect(game.recorder.value.step).toBe(0);
  });

  it('should leave the game as it was when nothing happens', () => {
    const game = createGameFixture();
    const start = game.state.value;

    watchGame(
      game,
      createKeyboardFixture(),
      new Subject<Pulse>(),
      PAGE,
    ).unsubscribe();

    expect(game.state.value).toBe(start);
  });
});
