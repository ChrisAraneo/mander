import {
  type Action,
  createInitialState,
  createRecorder,
  type GameLevel,
} from '@mander/engine';
import { type Tile, TILE_AIR } from '@mander/model';
import type { RenderedWorld } from '@mander/render';
import { constant, times } from 'lodash-es';
import { NEVER, Subject, type Subscription } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { ref, shallowRef } from 'vue';

import { createCanvasCell } from '../../canvas';
import type { Keyboard } from '../../input';
import { createReplaySession } from '../../use-replay';
import type { Game } from '../types/game';
import { drawGamePulse } from './draw-game-pulse';

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

const PULSE = { steps: 1, alpha: 0.5 };

const createGameFixture = (
  canvas: HTMLCanvasElement | null,
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
      cell: createCanvasCell(ref(canvas)),
      palette: WORLD.palette,
      levels: WORLD.levels,
      score: WORLD.score,
      rivals: [],
      frames: NEVER,
    },
  ),
});

describe('drawGamePulse', () => {
  it('should draw nothing when the canvas is not mounted', () => {
    expect(drawGamePulse(createGameFixture(null), PULSE)).toBeUndefined();
  });

  it('should leave the canvas alone when it has no drawing context yet', () => {
    const canvas = {} as unknown as HTMLCanvasElement;

    drawGamePulse(createGameFixture(canvas), PULSE);

    expect(canvas).toEqual({});
  });

  it('should leave the canvas alone when the replay is playing', () => {
    const canvas = {} as unknown as HTMLCanvasElement;
    const game = createGameFixture(canvas);
    game.replay.isActive.value = true;

    drawGamePulse(game, PULSE);

    expect(canvas).toEqual({});
  });
});
