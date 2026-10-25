import { type Tile } from '@mander/model';
import { pipe } from 'remeda';
import { patchTiles } from '../../structures/patch-tiles';
import type { TilePatch } from '../../types/tile-patch';
import { createPaintPatches } from './create-paint-patches';
import { createUnderpinPatches } from './create-underpin-patches';
import type { LayerPlacement } from './types/layer-placement';

export const createJoinedPatches = (
  tiles: Tile[][],
  layers: LayerPlacement[],
): TilePatch[] =>
  pipe(layers, createPaintPatches, (paint) => [
    ...paint,
    ...createUnderpinPatches(patchTiles(tiles, paint), layers),
  ]);
