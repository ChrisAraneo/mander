import {
  type Enemy,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SIZE,
  TILE_SPAWN,
} from '@mander/model';
import { constant, head, isEmpty, map, size } from 'lodash-es';
import { pipe } from 'remeda';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../state/create-initial-state';
import type { GameLevel } from '../types/game-level';
import type { GameState } from '../types/game-state';
import { CANNON_RELOAD_SECONDS } from './cannon/consts';
import {
  ENEMY_HEIGHT,
  FREEZING_ENEMY_MOVE_SPEED,
  FREEZING_RELOAD_SECONDS,
} from './enemy/consts';
import { createPatrol } from './enemy/internal/create-patrol';
import { nextGameState } from './next-game-state';
import {
  BASE_HEARTS,
  COLD_JUMP_HEIGHT_FACTOR,
  COLD_MOVE_FACTOR,
  COLD_SECONDS,
  PLAYER_HEIGHT,
  PLAYER_MAX_MOVE_VELOCITY,
} from './player/consts';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  S: TILE_SPAWN,
};

const ROWS = [
  '#............................#',
  '#............................#',
  '#............................#',
  '#............................#',
  '#............................#',
  '#............................#',
  '#............................#',
  '#............................#',
  '#............................#',
  '#............................#',
  '#.S..........................#',
  '#.S..........................#',
  '##############################',
  '##############################',
  '##############################',
];

const SURFACE = 12 * TILE_SIZE;

const DELTA_SECONDS = 1 / 60;

const PLAYER_X = 6 * TILE_SIZE;

const FREEZER_X = 12 * TILE_SIZE;

const CHILL_TICK_LIMIT = 300;

const JUMP_TICK_LIMIT = 300;

const HELD_COLD_SECONDS = 10;

const createTestLevel = (): GameLevel => ({
  seed: 'TEST',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const nextTick = (state: GameState): GameState =>
  nextGameState(state, { type: 'TICK' }, constant(0));

const nextTicksWhile = (
  state: GameState,
  tickLimit: number,
  isTicking: (state: GameState) => boolean,
): GameState =>
  match(tickLimit > 0 && isTicking(state))
    .with(true, () => nextTicksWhile(nextTick(state), tickLimit - 1, isTicking))
    .otherwise(() => state);

const createLoadedFreezer = (): Enemy => ({
  ...createPatrol({ x: FREEZER_X, y: SURFACE - ENEMY_HEIGHT }, 'FREEZING'),
  timers: { death: null, reload: 0 },
  statuses: { isFacingRight: true, isGrounded: true },
});

const createSettledState = (cold = 0): GameState =>
  pipe(
    createInitialState(createTestLevel(), 0, []),
    (state): GameState => ({
      ...state,
      enemies: [createLoadedFreezer()],
      player: {
        ...state.player,
        position: { x: PLAYER_X, y: SURFACE - PLAYER_HEIGHT },
        timers: { ...state.player.timers, cold },
      },
    }),
    (state) => nextTick(state),
  );

const nextTicksUntilThrown = (start: GameState): GameState =>
  nextTicksWhile(start, CHILL_TICK_LIMIT, (state) => isEmpty(state.snowballs));

const nextTicksUntilChilled = (start: GameState): GameState =>
  nextTicksWhile(
    start,
    CHILL_TICK_LIMIT,
    (state) => state.player.timers.cold <= 0,
  );

const computeJumpRiseFrom = (
  state: GameState,
  tickIndex: number,
  rise: number,
  startY: number,
): number =>
  pipe(
    state,
    nextTick,
    (ticked) => ({
      ticked,
      highest: Math.max(rise, startY - ticked.player.position.y),
    }),
    ({ ticked, highest }) =>
      match(
        (ticked.player.statuses.isGrounded && tickIndex > 2) ||
          tickIndex === JUMP_TICK_LIMIT - 1,
      )
        .with(true, () => highest)
        .otherwise(() =>
          computeJumpRiseFrom(ticked, tickIndex + 1, highest, startY),
        ),
  );

const computeJumpRise = (start: GameState): number =>
  pipe(
    start,
    (state) => nextGameState(state, { type: 'JUMP_START' }, constant(0)),
    (jumped) => computeJumpRiseFrom(jumped, 0, 0, start.player.position.y),
  );

const computeStepDistance = (start: GameState): number =>
  pipe(
    start,
    (state) => nextGameState(state, { type: 'MOVE_RIGHT_START' }, constant(0)),
    nextTick,
    (moved) => moved.player.position.x - start.player.position.x,
  );

describe('freezing enemies', () => {
  it('should reload as often as a cannon does when it is set to throw snowballs', () => {
    expect(FREEZING_RELOAD_SECONDS).toBe(CANNON_RELOAD_SECONDS);
  });

  it('should walk slowly like a shooter when it patrols', () => {
    const state = createSettledState();

    expect(state.enemies[0].velocity.x.max).toBe(FREEZING_ENEMY_MOVE_SPEED);
  });

  it('should throw a snowball when the player comes into range and the reload has run out', () => {
    const thrown = nextTicksUntilThrown(createSettledState());

    expect(size(thrown.snowballs)).toBe(1);
  });

  it('should wait a whole cannon reload before it throws again when it has just thrown', () => {
    const thrown = nextTicksUntilThrown(createSettledState());

    expect(thrown.enemies[0].timers.reload).toBeCloseTo(
      FREEZING_RELOAD_SECONDS - DELTA_SECONDS,
      6,
    );
  });

  it('should send the snowball towards the player when it throws', () => {
    const thrown = nextTicksUntilThrown(createSettledState());

    expect(thrown.snowballs[0].velocity.x.current).toBeLessThan(0);
  });

  it('should take no heart from the player when a snowball lands', () => {
    const chilled = nextTicksUntilChilled(createSettledState());

    expect(chilled.player.hearts.value).toBe(BASE_HEARTS);
    expect(chilled.status).toBe('PLAYING');
    expect(chilled.deaths).toBe(0);
  });

  it('should not make the player flash or go invincible when a snowball lands', () => {
    const chilled = nextTicksUntilChilled(createSettledState());

    expect(chilled.player.timers.hurt).toBe(0);
    expect(chilled.player.timers.invincibility).toBe(0);
  });

  it('should give the player two seconds of cold when a snowball lands', () => {
    const chilled = nextTicksUntilChilled(createSettledState());

    expect(COLD_SECONDS).toBe(2);
    expect(chilled.player.timers.cold).toBe(COLD_SECONDS);
  });

  it('should take the snowball out of the air when it lands on the player', () => {
    const chilled = nextTicksUntilChilled(createSettledState());

    expect(chilled.snowballs).toEqual([]);
  });

  it('should let the cold wear off when the two seconds have passed', () => {
    const warmed = nextTicksWhile(
      nextTicksUntilChilled(createSettledState()),
      Math.ceil(COLD_SECONDS / DELTA_SECONDS) + 2,
      (state) => state.player.timers.cold > 0,
    );

    expect(warmed.player.timers.cold).toBe(0);
  });

  it('should walk the cold player at half the usual speed when the player holds a direction', () => {
    const cold = createSettledState(HELD_COLD_SECONDS);

    const moved = nextGameState(
      cold,
      { type: 'MOVE_RIGHT_START' },
      constant(0),
    );

    expect(nextTick(moved).player.velocity.x.current).toBeCloseTo(
      PLAYER_MAX_MOVE_VELOCITY * COLD_MOVE_FACTOR,
      6,
    );
  });

  it('should cover half the ground in a tick when the cold player walks', () => {
    const coldStep = computeStepDistance(createSettledState(HELD_COLD_SECONDS));
    const warmStep = computeStepDistance(createSettledState());

    expect(coldStep / warmStep).toBeCloseTo(COLD_MOVE_FACTOR, 6);
  });

  it('should let the cold player jump only half as high when the player jumps', () => {
    const coldRise = computeJumpRise(createSettledState(HELD_COLD_SECONDS));
    const warmRise = computeJumpRise(createSettledState());

    expect(coldRise).toBeGreaterThan(0);
    expect(coldRise / warmRise).toBeCloseTo(COLD_JUMP_HEIGHT_FACTOR, 1);
  });
});
