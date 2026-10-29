import {
  type Action,
  createInitialState,
  createRecorder,
  type GameLevel,
} from '@mander/engine';
import { type Tile, TILE_AIR } from '@mander/model';
import type { RenderedWorld } from '@mander/render';
import { constant, get, invoke, times } from 'lodash-es';
import { NEVER, Subject, type Subscription } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { ref, shallowRef } from 'vue';

import { createCanvasCell } from '../../canvas';
import type { Keyboard } from '../../input';
import { createReplaySession } from '../../use-replay';
import type { Game } from '../types/game';
import { writeDebugGlobals } from './write-debug-globals';

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

describe('writeDebugGlobals', () => {
  it('should put the game state on the page when it writes the debug globals', () => {
    const game = createGameFixture();
    const page = {} as unknown as Window;

    writeDebugGlobals(game, page);

    expect(get(page, 'manderState')).toBe(game.state.value);
  });

  it('should hand an action sent from the page to the game when it writes the debug globals', () => {
    const game = createGameFixture();
    const page = {} as unknown as Window;
    const received: Action[] = [];
    game.actions.subscribe((action) => received.push(action));

    writeDebugGlobals(game, page);
    invoke(page, 'manderDispatch', { type: 'CLOSE' });

    expect(received).toEqual([{ type: 'CLOSE' }]);
  });

  it('should give back the same page when it writes the debug globals', () => {
    const page = {} as unknown as Window;

    expect(writeDebugGlobals(createGameFixture(), page)).toBe(page);
  });
});
