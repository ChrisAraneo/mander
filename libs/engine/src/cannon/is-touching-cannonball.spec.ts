import {
  type Cannonball,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { computePlayerHitbox } from '../player/compute-player-hitbox';
import { BASE_HEARTS } from '../player/consts';
import { createPlayer } from '../player/create-player';
import type { GameLevel } from '../state/types/game-level';
import {
  CANNONBALL_HITBOX_INSET,
  CANNONBALL_SIZE,
  CANNONBALL_SPEED,
} from './consts';
import { isTouchingCannonball } from './is-touching-cannonball';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const LEVEL = createLevel(['.....', '.....', '#####']);

const PLAYER_LEFT = 100;
const PLAYER_TOP = 100;
const INSIDE_LEFT = 105;
const INSIDE_TOP = 120;
const FAR_LEFT = 300;
const FAR_TOP = 300;
const ONE_PIXEL = 1;

const PLAYER: Player = {
  ...createPlayer(LEVEL, { hearts: { value: BASE_HEARTS } }),
  position: { x: PLAYER_LEFT, y: PLAYER_TOP },
};

const PLAYER_HITBOX = computePlayerHitbox(PLAYER);

const BALL_FRONT = CANNONBALL_SIZE - CANNONBALL_HITBOX_INSET;

const AT_LEFT_EDGE = PLAYER_HITBOX.left - BALL_FRONT;
const AT_RIGHT_EDGE = PLAYER_HITBOX.right - CANNONBALL_HITBOX_INSET;
const AT_TOP_EDGE = PLAYER_HITBOX.top - BALL_FRONT;
const AT_FOOT_EDGE = PLAYER_HITBOX.bottom - CANNONBALL_HITBOX_INSET;

const createCannonballAt = (left: number, top: number): Cannonball => ({
  position: { x: left, y: top },
  velocity: {
    x: { current: CANNONBALL_SPEED, max: CANNONBALL_SPEED },
    y: { current: 0, max: CANNONBALL_SPEED },
  },
});

describe('isTouchingCannonball', () => {
  it('should say yes when the cannonball flies into the player', () => {
    const cannonball = createCannonballAt(INSIDE_LEFT, INSIDE_TOP);

    const isTouching = isTouchingCannonball(PLAYER, cannonball);

    expect(isTouching).toBe(true);
  });

  it('should say yes when the cannonball just reaches past the left edge of the player', () => {
    const cannonball = createCannonballAt(AT_LEFT_EDGE + ONE_PIXEL, INSIDE_TOP);

    const isTouching = isTouchingCannonball(PLAYER, cannonball);

    expect(isTouching).toBe(true);
  });

  it('should say no when the cannonball is far from the player', () => {
    const cannonball = createCannonballAt(FAR_LEFT, FAR_TOP);

    const isTouching = isTouchingCannonball(PLAYER, cannonball);

    expect(isTouching).toBe(false);
  });

  it('should say no when the cannonball only meets the left edge of the player', () => {
    const cannonball = createCannonballAt(AT_LEFT_EDGE, INSIDE_TOP);

    const isTouching = isTouchingCannonball(PLAYER, cannonball);

    expect(isTouching).toBe(false);
  });

  it('should say no when the cannonball only meets the right edge of the player', () => {
    const cannonball = createCannonballAt(AT_RIGHT_EDGE, INSIDE_TOP);

    const isTouching = isTouchingCannonball(PLAYER, cannonball);

    expect(isTouching).toBe(false);
  });

  it('should say no when the cannonball only meets the top of the player', () => {
    const cannonball = createCannonballAt(INSIDE_LEFT, AT_TOP_EDGE);

    const isTouching = isTouchingCannonball(PLAYER, cannonball);

    expect(isTouching).toBe(false);
  });

  it('should say no when the cannonball only meets the feet of the player', () => {
    const cannonball = createCannonballAt(INSIDE_LEFT, AT_FOOT_EDGE);

    const isTouching = isTouchingCannonball(PLAYER, cannonball);

    expect(isTouching).toBe(false);
  });

  it('should not change the player or the cannonball it was given when they touch', () => {
    const player: Player = { ...PLAYER, position: { ...PLAYER.position } };
    const cannonball = createCannonballAt(INSIDE_LEFT, INSIDE_TOP);

    isTouchingCannonball(player, cannonball);

    expect(player).toEqual(PLAYER);
    expect(cannonball).toEqual(createCannonballAt(INSIDE_LEFT, INSIDE_TOP));
  });
});
