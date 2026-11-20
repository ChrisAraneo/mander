import { filter, flatMap, map } from 'lodash-es';
import type { TilePatch } from '../../types/tile-patch';
import { isDrawn } from './is-drawn';
import type { LayerPlacement } from './types/layer-placement';

const toLayerPatches = ({ layer, row, column }: LayerPlacement): TilePatch[] =>
  flatMap(layer, (layerRow, layerRowIndex) =>
    map(layerRow, (tile, layerColumn): TilePatch => ({
      row: row + layerRowIndex,
      column: column + layerColumn,
      tile,
    })),
  );

const filterDrawnPatches = (patches: TilePatch[]): TilePatch[] =>
  filter(patches, ({ tile }) => isDrawn(tile));

export const createPaintPatches = (layers: LayerPlacement[]): TilePatch[] =>
  flatMap(layers, (placement) => filterDrawnPatches(toLayerPatches(placement)));
