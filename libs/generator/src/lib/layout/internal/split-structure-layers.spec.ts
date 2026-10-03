import { TILE_BRICK, TILE_DIRT, type Tile } from '@mander/model';
import {
  type Sector,
  VERTICAL_BAND_HEIGHT,
  VERTICAL_HEIGHT,
} from '@mander/structures';
import { map, size, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { Placement } from './placement';
import { splitStructureLayers } from './split-structure-layers';

const FRONT = times(VERTICAL_HEIGHT, () => [TILE_DIRT]);

const BACK = times(VERTICAL_HEIGHT, () => [TILE_BRICK]);

const SECTOR: Sector = [FRONT, BACK];

const PLACEMENTS: Placement[] = [
  { structure: SECTOR, row: 4, column: 0 },
  { structure: SECTOR, row: 0, column: 20 },
];

const LEVEL: Tile[][] = [[TILE_DIRT]];

describe('splitStructureLayers', () => {
  it('should give each placement its front layer in a horizontal level when it splits the structures', () => {
    expect(
      map(
        splitStructureLayers({
          levelType: 'HORIZONTAL',
          placements: PLACEMENTS,
          tiles: LEVEL,
        }).fronts,
        'layer',
      ),
    ).toEqual([FRONT, FRONT]);
  });

  it('should give each placement its back layer in a horizontal level when it splits the structures', () => {
    expect(
      map(
        splitStructureLayers({
          levelType: 'HORIZONTAL',
          placements: PLACEMENTS,
          tiles: LEVEL,
        }).backs,
        'layer',
      ),
    ).toEqual([BACK, BACK]);
  });

  it('should cut both layers down to the band in a vertical level when it splits the structures', () => {
    const { fronts, backs } = splitStructureLayers({
      levelType: 'VERTICAL',
      placements: PLACEMENTS,
      tiles: LEVEL,
    });

    expect(map(fronts, ({ layer }) => size(layer))).toEqual([
      VERTICAL_BAND_HEIGHT,
      VERTICAL_BAND_HEIGHT,
    ]);
    expect(map(backs, ({ layer }) => size(layer))).toEqual([
      VERTICAL_BAND_HEIGHT,
      VERTICAL_BAND_HEIGHT,
    ]);
  });

  it('should keep the row and the column of each placement when it splits the structures', () => {
    const { fronts, backs } = splitStructureLayers({
      levelType: 'HORIZONTAL',
      placements: PLACEMENTS,
      tiles: LEVEL,
    });

    expect(map(fronts, ({ row, column }) => [row, column])).toEqual([
      [4, 0],
      [0, 20],
    ]);
    expect(map(backs, ({ row, column }) => [row, column])).toEqual([
      [4, 0],
      [0, 20],
    ]);
  });

  it('should give no layers when there are no placements', () => {
    const { fronts, backs } = splitStructureLayers({
      levelType: 'HORIZONTAL',
      placements: [],
      tiles: [],
    });

    expect(fronts).toEqual([]);
    expect(backs).toEqual([]);
  });

  it('should keep the grid the same when it splits the structures', () => {
    expect(
      splitStructureLayers({
        levelType: 'HORIZONTAL',
        placements: [],
        tiles: LEVEL,
      }).tiles,
    ).toBe(LEVEL);
  });

  it('should pass the level type on when it splits the structures', () => {
    expect(
      splitStructureLayers({ levelType: 'VERTICAL', placements: [], tiles: [] })
        .levelType,
    ).toBe('VERTICAL');
  });
});
