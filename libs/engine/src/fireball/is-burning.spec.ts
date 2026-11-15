import {
  type Level,
  type Player,
  type Tile,
  TILE_DIRT,
  TILE_FIREBALL,
  TILE_ICEBALL,
  TILE_PINKBALL,
  TILE_SIZE,
} from '@mander/model';
import { head, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../player/consts';
import { createBasePlayerVelocity } from '../player/create-base-player-velocity';
import { computeFireballPosition } from './compute-fireball-position';
import { createFireballs } from './create-fireballs';
import { isBurning } from './is-burning';

const HEARTS = 3;

const INVINCIBILITY_SECONDS = 1.5;

const CLEAR_TILES = 3;

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
  hearts: { value: HEARTS },
  timers: { death: null, invincibility, star: 0, hurt: 0, cold: 0 },
  statuses: {
    isFacingRight: true,
    isGrounded: false,
    isJumpQueued: false,
  },
});

const [FIREBALL] = createFireballs(createLevel([[TILE_FIREBALL], [TILE_DIRT]]));

const [ICEBALL] = createFireballs(createLevel([[TILE_ICEBALL], [TILE_DIRT]]));

const [PINKBALL] = createFireballs(createLevel([[TILE_PINKBALL], [TILE_DIRT]]));

const FIREBALL_POSITION = computeFireballPosition(FIREBALL);

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
        createPlayer(
          FIREBALL_POSITION.x + TILE_SIZE * CLEAR_TILES,
          FIREBALL_POSITION.y,
        ),
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
          INVINCIBILITY_SECONDS,
        ),
        [FIREBALL],
      ),
    ).toBe(false);
  });

  it('should scorch the player when the ball they stand in is a pink one', () => {
    expect(
      isBurning(
        createPlayer(
          computeFireballPosition(PINKBALL).x - PLAYER_WIDTH / 2,
          computeFireballPosition(PINKBALL).y - PLAYER_HEIGHT / 2,
        ),
        [PINKBALL],
      ),
    ).toBe(true);
  });

  it('should spare the player when the ball they stand in is an icy one', () => {
    expect(
      isBurning(
        createPlayer(
          FIREBALL_POSITION.x - PLAYER_WIDTH / 2,
          FIREBALL_POSITION.y - PLAYER_HEIGHT / 2,
        ),
        [ICEBALL],
      ),
    ).toBe(false);
  });

  it('should spare the player when nothing is burning', () => {
    expect(
      isBurning(createPlayer(FIREBALL_POSITION.x, FIREBALL_POSITION.y), []),
    ).toBe(false);
  });

  it('should leave the player and the balls unchanged when it looks for a burn', () => {
    const player = createPlayer(
      FIREBALL_POSITION.x - PLAYER_WIDTH / 2,
      FIREBALL_POSITION.y - PLAYER_HEIGHT / 2,
    );
    const fireballs = [FIREBALL];

    isBurning(player, fireballs);

    expect(player).toEqual(
      createPlayer(
        FIREBALL_POSITION.x - PLAYER_WIDTH / 2,
        FIREBALL_POSITION.y - PLAYER_HEIGHT / 2,
      ),
    );
    expect(fireballs).toEqual([FIREBALL]);
  });
});
