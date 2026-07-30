import {
  checkPlayerReach,
  TILE_AIR,
  TILE_DIRT,
  TILE_SPIKE,
  TILE_SPIKE_CEILING,
} from '@mander/engine';
import { every, filter, map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { SECTOR_WIDTH, STRUCTURE_HEIGHT } from '../consts';
import {
  formatStructure,
  isReachableSurface,
  structureSurfaces,
  structureTileMap,
} from './grid';
import { HARD_STRUCTURES, NORMAL_STRUCTURES } from './library';
import {
  AIR,
  BLOCK,
  ENEMY,
  SPIKE,
  SPIKE_CEILING,
  type Structure,
} from './types';

const CELL_ROW = [
  AIR,
  BLOCK,
  ENEMY,
  SPIKE,
  SPIKE_CEILING,
  ...map(Array.from({ length: SECTOR_WIDTH - 5 }), () => AIR),
];

const CELLS: Structure = map(
  Array.from({ length: STRUCTURE_HEIGHT }),
  () => CELL_ROW,
);

const TOWER: Structure = map(
  Array.from({ length: STRUCTURE_HEIGHT }),
  (_, row) =>
    map(Array.from({ length: SECTOR_WIDTH }), (__, column) =>
      row === STRUCTURE_HEIGHT - 1 || (row === 1 && column >= 8 && column <= 10)
        ? BLOCK
        : AIR,
    ),
);

describe('structureTileMap', () => {
  it('translates authoring cells into engine tiles', () => {
    const tiles = structureTileMap(CELLS);

    expect(tiles.width).toBe(SECTOR_WIDTH);
    expect(tiles.height).toBe(STRUCTURE_HEIGHT);
    expect(tiles.tiles[0].slice(0, 5)).toEqual([
      TILE_AIR,
      TILE_DIRT,
      TILE_AIR,
      TILE_SPIKE,
      TILE_SPIKE_CEILING,
    ]);
  });
});

describe('isReachableSurface', () => {
  it('marks the surfaces a tower strands', () => {
    const reach = checkPlayerReach(structureTileMap(TOWER));
    const stranded = filter(
      structureSurfaces(TOWER),
      (surface) => !isReachableSurface(reach, surface),
    );

    expect(map(stranded, (surface) => surface.col)).toEqual([8, 9, 10]);
  });

  it('leaves no surface of a shipped structure stranded', () => {
    const stranded = filter(
      map([...NORMAL_STRUCTURES, ...HARD_STRUCTURES], (grid) => ({
        grid,
        reach: checkPlayerReach(structureTileMap(grid)),
      })),
      ({ grid, reach }) =>
        !every(structureSurfaces(grid), (surface) =>
          isReachableSurface(reach, surface),
        ),
    );

    expect(map(stranded, ({ grid }) => formatStructure(grid))).toEqual([]);
  });
});
