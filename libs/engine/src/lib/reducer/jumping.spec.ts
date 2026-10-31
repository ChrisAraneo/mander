import {
  type Item,
  MAX_JUMP_TILES,
  type Tile,
  TILE_AIR,
  TILE_CHEST,
  TILE_DIRT,
  TILE_KEY,
  TILE_PORTAL,
  TILE_SIZE,
  TILE_SPAWN,
} from '@mander/model';
import { constant, head, map, size } from 'lodash-es';
import { pipe } from 'remeda';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../state/create-initial-state';
import type { GameLevel } from '../types/game-level';
import type { GameState } from '../types/game-state';
import { HORNED_ENEMY_CHANCE } from './enemy/consts';
import { nextGameState } from './next-game-state';
import { PLAYER_HEIGHT } from './player/consts';

interface HeldJump {
  hasLanded: boolean;
  hasRejumped: boolean;
}

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  S: TILE_SPAWN,
  K: TILE_KEY,
  C: TILE_CHEST,
  P: TILE_PORTAL,
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
  '#.S......................P...#',
  '#.S............K....C....P...#',
  '##########..##################',
  '##########..##################',
  '##########..##################',
];

const SURFACE = 12 * TILE_SIZE;

const HELD_JUMP_TICKS = 200;

const JUMP_APEX_TICKS = 300;

const createItem = (id: string, effect?: Item['effect']): Item => ({
  id,
  name: id,
  description: id,
  rarity: 'COMMON',
  effect: effect ?? { kind: 'NONE' },
});

const CARDS: Item[] = [
  createItem('CARD-0'),
  createItem('CARD-1'),
  createItem('CARD-2'),
  createItem('CARD-3'),
  createItem('CARD-4'),
];

const createTestLevel = (): GameLevel => ({
  seed: 'TEST',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: CARDS,
  hornedEnemyChance: HORNED_ENEMY_CHANCE,
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const nextTick = (state: GameState): GameState =>
  nextGameState(state, { type: 'TICK' }, constant(0));

const createSettledState = (left: number, inventory: Item[] = []): GameState =>
  pipe(
    createInitialState(createTestLevel(), 0, inventory),
    (state): GameState => ({
      ...state,
      player: {
        ...state.player,
        position: { x: left, y: SURFACE - PLAYER_HEIGHT },
      },
    }),
    (state) => nextTick(state),
  );

const computeJumpApexFrom = (
  state: GameState,
  holdTicks: number,
  tickIndex: number,
  apex: number,
): number =>
  pipe(
    match(tickIndex === holdTicks)
      .with(true, () =>
        nextGameState(state, { type: 'JUMP_STOP' }, constant(0)),
      )
      .otherwise(() => state),
    (released) => nextTick(released),
    (ticked) => ({
      ticked,
      lowest: Math.min(apex, ticked.player.position.y),
    }),
    ({ ticked, lowest }) =>
      match(
        (ticked.player.statuses.isGrounded && tickIndex > 2) ||
          tickIndex === JUMP_APEX_TICKS - 1,
      )
        .with(true, () => lowest)
        .otherwise(() =>
          computeJumpApexFrom(ticked, holdTicks, tickIndex + 1, lowest),
        ),
  );

const computeJumpApex = (start: GameState, holdTicks: number): number =>
  pipe(
    start,
    (state) => nextGameState(state, { type: 'JUMP_START' }, constant(0)),
    (jumped) =>
      computeJumpApexFrom(jumped, holdTicks, 0, jumped.player.position.y),
  );

const computeHeldJump = (
  state: GameState,
  tickIndex: number,
  hasLanded: boolean,
): HeldJump =>
  pipe(
    state,
    nextTick,
    (ticked) => ({
      ticked,
      isGrounded: ticked.player.statuses.isGrounded,
      hasRejumped:
        !ticked.player.statuses.isGrounded &&
        hasLanded &&
        ticked.player.velocity.y.current < 0,
    }),
    ({ ticked, isGrounded, hasRejumped }) =>
      match({ hasRejumped, isLastTick: tickIndex === HELD_JUMP_TICKS - 1 })
        .with({ hasRejumped: true }, (): HeldJump => ({
          hasLanded,
          hasRejumped: true,
        }))
        .with({ isLastTick: true }, (): HeldJump => ({
          hasLanded: hasLanded || isGrounded,
          hasRejumped: false,
        }))
        .otherwise(() =>
          computeHeldJump(ticked, tickIndex + 1, hasLanded || isGrounded),
        ),
  );

describe('jumping', () => {
  it('should jump only when the player is grounded', () => {
    const start = createSettledState(3 * TILE_SIZE);
    const pressed = nextGameState(start, { type: 'JUMP_START' }, constant(0));
    const rising = nextTick(pressed);

    expect(rising.player.velocity.y.current).toBeLessThan(0);
    expect(rising.player.statuses.isGrounded).toBe(false);

    const released = nextGameState(rising, { type: 'JUMP_STOP' }, constant(0));
    const risingVelocityY = released.player.velocity.y.current;
    const pressedAgain = nextGameState(
      released,
      { type: 'JUMP_START' },
      constant(0),
    );
    const ticked = nextTick(pressedAgain);

    expect(ticked.player.velocity.y.current).toBeGreaterThan(risingVelocityY);
    expect(ticked.player.velocity.y.current).toBeLessThan(0);
  });

  it('should ignore the jump when the key is only being held down', () => {
    const start = createSettledState(3 * TILE_SIZE);
    const pressed = nextGameState(start, { type: 'JUMP_START' }, constant(0));
    const jumped = nextTick(pressed);
    const rising = jumped.player.velocity.y.current;
    const held = nextGameState(jumped, { type: 'JUMP_START' }, constant(0));
    const ticked = nextTick(held);

    expect(ticked.player.velocity.y.current).toBeGreaterThan(rising);
    expect(ticked.player.velocity.y.current).toBeLessThan(0);
  });

  it('should jump again on landing when the jump button stays held', () => {
    const start = createSettledState(3 * TILE_SIZE);
    const pressed = nextGameState(start, { type: 'JUMP_START' }, constant(0));

    const { hasLanded, hasRejumped } = computeHeldJump(pressed, 0, false);

    expect(hasLanded).toBe(true);
    expect(hasRejumped, 'a held jump bounces again after touching down').toBe(
      true,
    );
  });

  it('should jump lower when the press is a short tap rather than a held one', () => {
    const start = createSettledState(3 * TILE_SIZE);
    const tapApex = computeJumpApex(start, 3);
    const heldApex = computeJumpApex(start, 100);
    const surfaceY = SURFACE - PLAYER_HEIGHT;

    expect(tapApex).toBeLessThan(surfaceY);
    expect(heldApex).toBeLessThan(surfaceY);
    expect(surfaceY - heldApex).toBeGreaterThan((surfaceY - tapApex) * 1.5);
  });

  it('should clear the tallest climb the generator hands out and no more when the player jumps', () => {
    const rise =
      SURFACE -
      PLAYER_HEIGHT -
      computeJumpApex(createSettledState(3 * TILE_SIZE), 100);

    expect(rise).toBeGreaterThan((MAX_JUMP_TILES - 1) * TILE_SIZE);
    expect(rise).toBeLessThan(MAX_JUMP_TILES * TILE_SIZE);
  });
});
