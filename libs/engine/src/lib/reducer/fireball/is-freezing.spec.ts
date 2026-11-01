import {
  type Level,
  type Player,
  type Tile,
  TILE_DIRT,
  TILE_FIREBALL,
  TILE_ICEBALL,
  TILE_SIZE,
} from '@mander/model';
import { head, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../player/consts';
import { createBasePlayerVelocity } from '../player/create-base-player-velocity';
import { createFireballs } from './create-fireballs';
import { getFireballPosition } from './get-fireball-position';
import { isFreezing } from './is-freezing';

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

const [ICEBALL] = createFireballs(createLevel([[TILE_ICEBALL], [TILE_DIRT]]));

const [FIREBALL] = createFireballs(createLevel([[TILE_FIREBALL], [TILE_DIRT]]));

const ICEBALL_POSITION = getFireballPosition(ICEBALL);

const createTouchingPlayer = (invincibility = 0): Player =>
  createPlayer(
    ICEBALL_POSITION.x - PLAYER_WIDTH / 2,
    ICEBALL_POSITION.y - PLAYER_HEIGHT / 2,
    invincibility,
  );

describe('isFreezing', () => {
  it('should chill the player when they stand in the ice ball', () => {
    expect(isFreezing(createTouchingPlayer(), [ICEBALL])).toBe(true);
  });

  it('should chill the player even while they are still invincible', () => {
    expect(isFreezing(createTouchingPlayer(1.5), [ICEBALL])).toBe(true);
  });

  it('should spare the player when they stand clear of the ice ball', () => {
    expect(
      isFreezing(
        createPlayer(ICEBALL_POSITION.x + TILE_SIZE * 3, ICEBALL_POSITION.y),
        [ICEBALL],
      ),
    ).toBe(false);
  });

  it('should spare the player when the ball they stand in burns instead', () => {
    expect(isFreezing(createTouchingPlayer(), [FIREBALL])).toBe(false);
  });

  it('should spare the player when no ball is spinning', () => {
    expect(isFreezing(createTouchingPlayer(), [])).toBe(false);
  });
});
