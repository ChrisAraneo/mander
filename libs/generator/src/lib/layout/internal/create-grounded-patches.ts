import type { Tile } from '@mander/model';
import { chain } from '@mander/utils';
import { patchTiles } from '../../structures/patch-tiles';
import type { TilePatch } from '../../types/tile-patch';
import { createGroundPatches } from './create-ground-patches';
import { createPaintPatches } from './create-paint-patches';
import type { LayerPlacement } from './layer-placement';

export const createGroundedPatches = (
  tiles: Tile[][],
  layers: LayerPlacement[],
): TilePatch[] =>
  chain(createPaintPatches(layers))
    .thru((paint) => [
      ...paint,
      ...createGroundPatches(patchTiles(tiles, paint)),
    ])
    .value();
