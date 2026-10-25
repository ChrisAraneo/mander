import { filter, flatMap, map } from 'lodash-es';
import type { TilePatch } from '../../types/tile-patch';
import { isDrawn } from './is-drawn';
import type { LayerPlacement } from './types/layer-placement';

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
