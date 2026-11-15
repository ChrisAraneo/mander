import {
  type FallingSpike,
  type Level,
  PRONG_HEIGHT,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SIZE,
  TILE_SPIKE_FALLING,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { pipe } from 'remeda';
import { describe, expect, it } from 'vitest';

import { BASE_HEARTS, PLAYER_HEIGHT, PLAYER_WIDTH } from '../player/consts';
import { createBasePlayerVelocity } from '../player/create-base-player-velocity';
import { createFallingSpikes } from './create-falling-spikes';
import { isTouchingFallingSpike } from './is-touching-falling-spike';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  v: TILE_SPIKE_FALLING,
};

const ROWS = [
  '############',
  '.....v......',
  '............',
  '............',
  '............',
  '............',
  '............',
  '............',
  '############',
  '............',
];

const FLOOR_ROW = 8;

const SPIKE_COLUMN = 5;

const PLAYER_ROWS_ABOVE_FLOOR = 2;

const NO_GAP = 0;

const LEFT_COLUMN = 0;

const createLevel = (): Level => ({
  seed: 'SEED',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
});

const createPlayer = (column: number): Player => ({
  position: {
    x: column * TILE_SIZE,
    y: (FLOOR_ROW - PLAYER_ROWS_ABOVE_FLOOR) * TILE_SIZE,
  },
  velocity: createBasePlayerVelocity(),
  hearts: { value: BASE_HEARTS },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0, cold: 0 },
  statuses: { isFacingRight: true, isGrounded: true, isJumpQueued: false },
});

const createFallingSpike = (level: Level): FallingSpike =>
  createFallingSpikes(level)[0];

const SPIKE_CENTRE = SPIKE_COLUMN * TILE_SIZE + TILE_SIZE / 2;

const createPlayerAt = (gap: number): Player =>
  pipe(LEFT_COLUMN, createPlayer, (walking): Player => ({
    ...walking,
    position: {
      ...walking.position,
      x: SPIKE_CENTRE + gap - PLAYER_WIDTH / 2,
    },
  }));

const createPlayerUnder = (spikeY: number): Player =>
  pipe(NO_GAP, createPlayerAt, (standing): Player => ({
    ...standing,
    position: {
      ...standing.position,
      y: spikeY + PRONG_HEIGHT - PLAYER_HEIGHT / 2,
    },
  }));

const createPlayerAside = (spike: FallingSpike): Player =>
  pipe(spike.position.y, createPlayerUnder, (standing): Player => ({
    ...standing,
    position: {
      ...standing.position,
      x: spike.position.x + TILE_SIZE + PLAYER_WIDTH,
    },
  }));

describe('isTouchingFallingSpike', () => {
  it('should bite the player when the prong has reached them', () => {
    const spike = createFallingSpike(createLevel());

    const isTouching = isTouchingFallingSpike(
      spike,
      createPlayerUnder(spike.position.y),
    );

    expect(isTouching).toBe(true);
  });

  it('should leave the player alone when they stand clear of the prong', () => {
    const spike = createFallingSpike(createLevel());

    const isTouching = isTouchingFallingSpike(spike, createPlayerAside(spike));

    expect(isTouching).toBe(false);
  });

  it('should leave the given spike and player unchanged when it looks at the bite', () => {
    const spike = createFallingSpike(createLevel());
    const player = createPlayerUnder(spike.position.y);

    isTouchingFallingSpike(spike, player);

    expect(spike).toEqual(createFallingSpike(createLevel()));
    expect(player).toEqual(createPlayerUnder(spike.position.y));
  });
});
