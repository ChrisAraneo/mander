import { isSolidTile, type Tile, TILE_AIR } from '@mander/model';
import { STRUCTURE_HEIGHT } from '@mander/structures';
import { filter, flatMap, map, range, size, uniqBy } from 'lodash-es';
import type { TilePatch } from '../../types/tile-patch';
import type { LayerPlacement } from './layer-placement';

const BOTTOM_ROW = STRUCTURE_HEIGHT - 1;

const createLayerUnderpinPatches = (
  tiles: Tile[][],
  placement: LayerPlacement,
): TilePatch[] =>
  filter(
    flatMap(
      filter(
        map(placement.layer[BOTTOM_ROW] ?? [], (tile, layerColumn) => ({
          column: placement.column + layerColumn,
          tile,
        })),
        ({ tile }) => isSolidTile(tile),
      ),
      ({ column, tile }) =>
        map(
          range(placement.row + STRUCTURE_HEIGHT, size(tiles)),
          (row): TilePatch => ({ row, column, tile }),
        ),
    ),
    ({ row, column }) => tiles[row][column] === TILE_AIR,
  );

export const createUnderpinPatches = (
  tiles: Tile[][],
  layers: LayerPlacement[],
): TilePatch[] =>
  uniqBy(
    flatMap(layers, (placement) =>
      createLayerUnderpinPatches(tiles, placement),
    ),
    ({ row, column }) => `${row}#${column}`,
  );
