import { isSolidTile, type Tile, TILE_AIR } from '@mander/model';
import { STRUCTURE_HEIGHT } from '@mander/structures';
import { chain } from '@mander/utils';
import { flatMap, map, range, size, uniqBy } from 'lodash-es';
import type { TilePatch } from '../../types/tile-patch';
import type { LayerPlacement } from './layer-placement';

const BOTTOM_ROW = STRUCTURE_HEIGHT - 1;

const underpinLayer = (
  tiles: Tile[][],
  placement: LayerPlacement,
): TilePatch[] =>
  chain(placement.layer[BOTTOM_ROW] ?? [])
    .map((tile, layerColumn) => ({
      tile,
      column: placement.column + layerColumn,
    }))
    .filter(({ tile }) => isSolidTile(tile))
    .flatMap(({ tile, column }) =>
      map(
        range(placement.row + STRUCTURE_HEIGHT, size(tiles)),
        (row): TilePatch => ({ row, column, tile }),
      ),
    )
    .filter(({ row, column }) => tiles[row][column] === TILE_AIR)
    .value();

export const createUnderpinPatches = (
  tiles: Tile[][],
  layers: LayerPlacement[],
): TilePatch[] =>
  uniqBy(
    flatMap(layers, (placement) => underpinLayer(tiles, placement)),
    ({ row, column }) => `${row}#${column}`,
  );
