import { isSolidTile, type Tile, TILE_AIR } from '@mander/model';
import { STRUCTURE_HEIGHT } from '@mander/structures';
import { filter, flatMap, map, range, size } from 'lodash-es';
import { pipe } from 'remeda';
import type { TilePatch } from '../../types/tile-patch';
import type { LayerBottomCell } from './types/layer-bottom-cell';
import type { LayerPlacement } from './types/layer-placement';

const BOTTOM_ROW = STRUCTURE_HEIGHT - 1;

const toBottomCells = ({ layer, column }: LayerPlacement): LayerBottomCell[] =>
  map(layer[BOTTOM_ROW] ?? [], (tile, layerColumn) => ({
    column: column + layerColumn,
    tile,
  }));

const filterSolidCells = (cells: LayerBottomCell[]): LayerBottomCell[] =>
  filter(cells, ({ tile }) => isSolidTile(tile));

const createColumnPatches = (
  tiles: Tile[][],
  placement: LayerPlacement,
  cells: LayerBottomCell[],
): TilePatch[] =>
  flatMap(cells, ({ column, tile }) =>
    map(
      range(placement.row + STRUCTURE_HEIGHT, size(tiles)),
      (row): TilePatch => ({ row, column, tile }),
    ),
  );

const filterAirPatches = (tiles: Tile[][], patches: TilePatch[]): TilePatch[] =>
  filter(patches, ({ row, column }) => tiles[row][column] === TILE_AIR);

export const createLayerUnderpinPatches = (
  tiles: Tile[][],
  placement: LayerPlacement,
): TilePatch[] =>
  pipe(
    placement,
    toBottomCells,
    filterSolidCells,
    (cells) => createColumnPatches(tiles, placement, cells),
    (patches) => filterAirPatches(tiles, patches),
  );
