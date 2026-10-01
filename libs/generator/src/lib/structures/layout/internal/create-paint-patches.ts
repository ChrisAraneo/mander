import { type Tile, TILE_AIR } from '@mander/model';
import { STRUCTURE_END, STRUCTURE_START } from '@mander/structures';
import { filter, flatMap, map } from 'lodash-es';
import type { TilePatch } from '../../types/tile-patch';
import type { LayerPlacement } from './layer-placement';

const isDrawn = (tile: Tile): boolean =>
  tile !== TILE_AIR && tile !== STRUCTURE_START && tile !== STRUCTURE_END;

export const createPaintPatches = (layers: LayerPlacement[]): TilePatch[] =>
  flatMap(layers, ({ layer, row, column }) =>
    filter(
      flatMap(layer, (cells, layerRow) =>
        map(cells, (tile, layerColumn): TilePatch => ({
          row: row + layerRow,
          column: column + layerColumn,
          tile,
        })),
      ),
      (patch) => isDrawn(patch.tile),
    ),
  );
