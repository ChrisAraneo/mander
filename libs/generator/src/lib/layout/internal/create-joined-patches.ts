import type { Tile } from '@mander/model';
import { patchTiles } from '../../structures/patch-tiles';
import type { TilePatch } from '../../types/tile-patch';
import { createPaintPatches } from './create-paint-patches';
import { createUnderpinPatches } from './create-underpin-patches';
import type { LayerPlacement } from './types/layer-placement';

const addUnderpinPatches = (
  tiles: Tile[][],
  layers: LayerPlacement[],
  paint: TilePatch[],
): TilePatch[] => [
  ...paint,
  ...createUnderpinPatches(patchTiles(tiles, paint), layers),
];

export const createJoinedPatches = (
  tiles: Tile[][],
  layers: LayerPlacement[],
): TilePatch[] => addUnderpinPatches(tiles, layers, createPaintPatches(layers));
