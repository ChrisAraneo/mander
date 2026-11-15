import {
  computeSpikeTriangles,
  getSpikeOrientation,
  getSpikeShape,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SIZE,
  TILE_SPIKE,
  TILE_SPIKE_CEILING,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../state/types/game-level';
import { computeTileSpikeTriangles } from './compute-tile-spike-triangles';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  '^': TILE_SPIKE,
  v: TILE_SPIKE_CEILING,
};

const LEVEL_ROWS = ['..v..', '.....', '..^..', '#####'];

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

const LEVEL = createLevel(LEVEL_ROWS);

const SPIKE_COLUMN = 2;

const FLOOR_SPIKE_ROW = 2;

const CEILING_SPIKE_ROW = 0;

const FLOOR_SPIKE_TILE = { x: SPIKE_COLUMN, y: FLOOR_SPIKE_ROW };

const CEILING_SPIKE_TILE = { x: SPIKE_COLUMN, y: CEILING_SPIKE_ROW };

describe('computeTileSpikeTriangles', () => {
  it('should place the prongs at the corner of the tile when the spike stands on the floor', () => {
    expect(computeTileSpikeTriangles(LEVEL, FLOOR_SPIKE_TILE)).toEqual(
      computeSpikeTriangles(
        SPIKE_COLUMN * TILE_SIZE,
        FLOOR_SPIKE_ROW * TILE_SIZE,
        getSpikeOrientation(LEVEL, SPIKE_COLUMN, FLOOR_SPIKE_ROW),
        getSpikeShape(LEVEL, SPIKE_COLUMN, FLOOR_SPIKE_ROW),
      ),
    );
  });

  it('should turn the prongs the other way when the spike hangs from the ceiling', () => {
    expect(computeTileSpikeTriangles(LEVEL, CEILING_SPIKE_TILE)).not.toEqual(
      computeTileSpikeTriangles(LEVEL, FLOOR_SPIKE_TILE),
    );
  });

  it('should leave the level it was handed untouched when it works out the prongs', () => {
    const level = createLevel(LEVEL_ROWS);

    computeTileSpikeTriangles(level, FLOOR_SPIKE_TILE);

    expect(level).toEqual(createLevel(LEVEL_ROWS));
  });
});
