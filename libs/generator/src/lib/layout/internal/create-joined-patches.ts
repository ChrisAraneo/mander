import type { Tile } from '@mander/model';
import { chain } from '@mander/utils';
import { patchTiles } from '../../structures/patch-tiles';
import type { TilePatch } from '../../types/tile-patch';
import { createPaintPatches } from './create-paint-patches';
import { createUnderpinPatches } from './create-underpin-patches';
import type { LayerPlacement } from './layer-placement';

export const createJoinedPatches = (
  tiles: Tile[][],
  layers: LayerPlacement[],
): TilePatch[] =>
  chain(createPaintPatches(layers))
    .thru((paint) => [
      ...paint,
      ...createUnderpinPatches(patchTiles(tiles, paint), layers),
    ])
    .value();
