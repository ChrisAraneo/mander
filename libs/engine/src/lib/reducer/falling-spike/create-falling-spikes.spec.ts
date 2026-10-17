import {
  type Level,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SIZE,
  TILE_SPIKE_FALLING,
} from '@mander/model';
import { times } from 'lodash-es';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { createFallingSpikes } from './create-falling-spikes';

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

describe('createFallingSpikes', () => {
  it('should hang one unmoving spike when a tile asks for it', () => {
    expect(createFallingSpikes(createRoom())).toEqual([
      {
        position: {
          x: SPIKE_COLUMN * TILE_SIZE,
          y: CEILING_ROW * TILE_SIZE,
        },
        velocity: { y: { current: 0, max: expect.any(Number) } },
        statuses: { isFalling: false },
      },
    ]);
  });

  it('should find nothing to hang when the room holds no such tile', () => {
    const bare = createRoom();
    bare.tiles[CEILING_ROW][SPIKE_COLUMN] = TILE_AIR;

    expect(createFallingSpikes(bare)).toEqual([]);
  });
});
