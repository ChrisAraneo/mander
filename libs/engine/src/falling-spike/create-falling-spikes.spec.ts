import {
  type Level,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SIZE,
  TILE_SPIKE_FALLING,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createFallingSpikes } from './create-falling-spikes';

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

const BARE_ROWS = [
  '############',
  '............',
  '............',
  '............',
  '............',
  '............',
  '............',
  '............',
  '############',
  '............',
];

const CEILING_ROW = 1;

const SPIKE_COLUMN = 5;

const NO_SPEED = 0;

const createLevel = (rows: string[]): Level => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
});

describe('createFallingSpikes', () => {
  it('should hang one unmoving spike when a tile asks for it', () => {
    const spikes = createFallingSpikes(createLevel(ROWS));

    expect(spikes).toEqual([
      {
        position: {
          x: SPIKE_COLUMN * TILE_SIZE,
          y: CEILING_ROW * TILE_SIZE,
        },
        velocity: { y: { current: NO_SPEED, max: expect.any(Number) } },
        statuses: { isFalling: false },
      },
    ]);
  });

  it('should find nothing to hang when the level holds no such tile', () => {
    const spikes = createFallingSpikes(createLevel(BARE_ROWS));

    expect(spikes).toEqual([]);
  });

  it('should leave the given level unchanged when it hangs the spikes', () => {
    const level = createLevel(ROWS);

    createFallingSpikes(level);

    expect(level).toEqual(createLevel(ROWS));
  });
});
