import { TILE_AIR, TILE_DIRT, type Tile } from '@mander/model';
import { STRUCTURE_HEIGHT } from '@mander/structures';
import { map, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createStructurePatches } from './create-structure-patches';
import type { LayerPlacement } from './layer-placement';

const LEVEL: Tile[][] = times(STRUCTURE_HEIGHT + 1, () => [TILE_AIR]);

const LAYERS: LayerPlacement[] = [
  {
    layer: [...times(STRUCTURE_HEIGHT - 1, () => [TILE_AIR]), [TILE_DIRT]],
    row: 0,
    column: 0,
  },
];

const findRows = (patches: { row: number }[]): number[] => map(patches, 'row');

describe('createStructurePatches', () => {
  it('should paint the front and prop it up to the floor in a horizontal level when it makes the marks', () => {
    expect(
      findRows(
        createStructurePatches({
          levelType: 'HORIZONTAL',
          tiles: LEVEL,
          fronts: LAYERS,
          backs: [],
        }).frontPatches,
      ),
    ).toEqual([STRUCTURE_HEIGHT - 1, STRUCTURE_HEIGHT]);
  });

  it('should paint the back and prop it up to the floor in a horizontal level when it makes the marks', () => {
    expect(
      findRows(
        createStructurePatches({
          levelType: 'HORIZONTAL',
          tiles: LEVEL,
          fronts: [],
          backs: LAYERS,
        }).backPatches,
      ),
    ).toEqual([STRUCTURE_HEIGHT - 1, STRUCTURE_HEIGHT]);
  });

  it('should paint the front and lay the ground under it in a vertical level when it makes the marks', () => {
    expect(
      findRows(
        createStructurePatches({
          levelType: 'VERTICAL',
          tiles: LEVEL,
          fronts: LAYERS,
          backs: [],
        }).frontPatches,
      ),
    ).toEqual([STRUCTURE_HEIGHT - 1, STRUCTURE_HEIGHT - 2, STRUCTURE_HEIGHT]);
  });

  it('should only paint the back in a vertical level when it makes the marks', () => {
    expect(
      createStructurePatches({
        levelType: 'VERTICAL',
        tiles: LEVEL,
        fronts: [],
        backs: LAYERS,
      }).backPatches,
    ).toEqual([{ row: STRUCTURE_HEIGHT - 1, column: 0, tile: TILE_DIRT }]);
  });

  it('should make no marks in a horizontal level when the grid is empty and there are no layers', () => {
    const { frontPatches, backPatches } = createStructurePatches({
      levelType: 'HORIZONTAL',
      tiles: [],
      fronts: [],
      backs: [],
    });

    expect(frontPatches).toEqual([]);
    expect(backPatches).toEqual([]);
  });

  it('should make no marks in a vertical level when the grid is empty and there are no layers', () => {
    const { frontPatches, backPatches } = createStructurePatches({
      levelType: 'VERTICAL',
      tiles: [],
      fronts: [],
      backs: [],
    });

    expect(frontPatches).toEqual([]);
    expect(backPatches).toEqual([]);
  });

  it('should keep the grid the same when it makes the marks', () => {
    expect(
      createStructurePatches({
        levelType: 'HORIZONTAL',
        tiles: LEVEL,
        fronts: [],
        backs: [],
      }).tiles,
    ).toBe(LEVEL);
  });
});
