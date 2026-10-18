import { type FallingSpike, type Level, PRONG_HEIGHT, type Player, type Tile, TILE_AIR, TILE_DIRT, TILE_SIZE, TILE_SPIKE_FALLING, chain } from '@mander/model';
import { times } from 'lodash-es';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../player/consts';
import { createBasePlayerVelocity } from '../player/create-base-player-velocity';
import { createFallingSpikes } from './create-falling-spikes';
import { isTouchingFallingSpike } from './is-touching-falling-spike';

const CEILING_ROW = 1;

const FLOOR_ROW = 8;

const SPIKE_COLUMN = 5;

const WIDTH = 12;

const HEIGHT = 10;

const createRoom = (): Level => ({
  seed: 'SEED',
  width: WIDTH,
  height: HEIGHT,
  tiles: times(HEIGHT, (row): Tile[] =>
    times(WIDTH, (column) =>
      match({
        isDirt: row === 0 || row === FLOOR_ROW,
        isSpike: row === CEILING_ROW && column === SPIKE_COLUMN,
      })
        .with({ isDirt: true }, (): Tile => TILE_DIRT)
        .with({ isSpike: true }, (): Tile => TILE_SPIKE_FALLING)
        .otherwise((): Tile => TILE_AIR),
    ),
  ),
  chestItems: [],
});

const createPlayer = (tileX: number): Player => ({
  position: {
    x: tileX * TILE_SIZE,
    y: (FLOOR_ROW - 2) * TILE_SIZE,
  },
  velocity: createBasePlayerVelocity(),
  hearts: { value: 3 },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0 },
  statuses: { isFacingRight: true, isGrounded: true, isJumpQueued: false },
});

const createFallingSpike = (level: Level): FallingSpike =>
  createFallingSpikes(level)[0];

const SPIKE_CENTRE = SPIKE_COLUMN * TILE_SIZE + TILE_SIZE / 2;

const createPlayerAt = (gap: number): Player =>
  chain(createPlayer(0))
    .thru((walking): Player => ({
      ...walking,
      position: {
        ...walking.position,
        x: SPIKE_CENTRE + gap - PLAYER_WIDTH / 2,
      },
    }))
    .value();

const createPlayerUnder = (spikeY: number): Player =>
  chain(createPlayerAt(0))
    .thru((standing): Player => ({
      ...standing,
      position: {
        ...standing.position,
        y: spikeY + PRONG_HEIGHT - PLAYER_HEIGHT / 2,
      },
    }))
    .value();

describe('isTouchingFallingSpike', () => {
  it('should bite the player when the prong has reached them', () => {
    const level = createRoom();
    const spike = createFallingSpike(level);

    expect(
      isTouchingFallingSpike(createPlayerUnder(spike.position.y), spike),
    ).toBe(true);
  });

  it('should leave the player alone when they stand clear of the prong', () => {
    const level = createRoom();
    const spike = createFallingSpike(level);
    const aside = createPlayerUnder(spike.position.y);
    aside.position.x = spike.position.x + TILE_SIZE + PLAYER_WIDTH;

    expect(isTouchingFallingSpike(aside, spike)).toBe(false);
  });
});
