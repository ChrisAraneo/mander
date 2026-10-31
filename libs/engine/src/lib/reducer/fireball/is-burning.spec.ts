import {
  type Level,
  type Player,
  type Tile,
  TILE_DIRT,
  TILE_FIREBALL,
  TILE_SIZE,
} from '@mander/model';
import { head, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../player/consts';
import { createBasePlayerVelocity } from '../player/create-base-player-velocity';
import { createFireballs } from './create-fireballs';
import { getFireballPosition } from './get-fireball-position';
import { isBurning } from './is-burning';

const createLevel = (tiles: Tile[][]): Level => ({
  seed: 'SEED',
  width: size(head(tiles)),
  height: size(tiles),
  tiles,
  chestItems: [],
});

const createPlayer = (
  left: number,
  top: number,
  invincibility = 0,
): Player => ({
  position: { x: left, y: top },
  velocity: createBasePlayerVelocity(),
  hearts: { value: 3 },
  timers: { death: null, invincibility, star: 0, hurt: 0, cold: 0 },
  statuses: {
    isFacingRight: true,
    isGrounded: false,
    isJumpQueued: false,
  },
});

const [FIREBALL] = createFireballs(createLevel([[TILE_FIREBALL], [TILE_DIRT]]));

const FIREBALL_POSITION = getFireballPosition(FIREBALL);

describe('isBurning', () => {
  it('should scorch the player when they stand in the flame', () => {
    expect(
      isBurning(
        createPlayer(
          FIREBALL_POSITION.x - PLAYER_WIDTH / 2,
          FIREBALL_POSITION.y - PLAYER_HEIGHT / 2,
        ),
        [FIREBALL],
      ),
    ).toBe(true);
  });

  it('should spare the player when they stand clear of the flame', () => {
    expect(
      isBurning(
        createPlayer(FIREBALL_POSITION.x + TILE_SIZE * 3, FIREBALL_POSITION.y),
        [FIREBALL],
      ),
    ).toBe(false);
  });

  it('should spare the player when they are still invincible', () => {
    expect(
      isBurning(
        createPlayer(
          FIREBALL_POSITION.x - PLAYER_WIDTH / 2,
          FIREBALL_POSITION.y - PLAYER_HEIGHT / 2,
          1.5,
        ),
        [FIREBALL],
      ),
    ).toBe(false);
  });

  it('should spare the player when nothing is burning', () => {
    expect(
      isBurning(createPlayer(FIREBALL_POSITION.x, FIREBALL_POSITION.y), []),
    ).toBe(false);
  });
});
