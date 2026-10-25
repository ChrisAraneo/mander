import { type Tile } from '@mander/model';
import { pipe } from 'remeda';
import { patchTiles } from '../../structures/patch-tiles';
import type { TilePatch } from '../../types/tile-patch';
import { createGroundPatches } from './create-ground-patches';
import { createPaintPatches } from './create-paint-patches';
import type { LayerPlacement } from './types/layer-placement';

export const createGroundedPatches = (
  tiles: Tile[][],
  layers: LayerPlacement[],
): TilePatch[] =>
  pipe(layers, createPaintPatches, (paint) => [
    ...paint,
    ...createGroundPatches(patchTiles(tiles, paint)),
  ]);
