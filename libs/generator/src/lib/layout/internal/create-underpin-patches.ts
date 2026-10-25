import type { Tile } from '@mander/model';
import { flatMap, uniqBy } from 'lodash-es';
import type { TilePatch } from '../../types/tile-patch';
import { createLayerUnderpinPatches } from './create-layer-underpin-patches';
import type { LayerPlacement } from './types/layer-placement';

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
