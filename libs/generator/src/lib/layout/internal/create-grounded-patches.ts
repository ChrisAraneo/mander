import type { Tile } from '@mander/model';
import { patchTiles } from '../../structures/patch-tiles';
import type { TilePatch } from '../../types/tile-patch';
import { createGroundPatches } from './create-ground-patches';
import { createPaintPatches } from './create-paint-patches';
import type { LayerPlacement } from './types/layer-placement';

const addGroundPatches = (tiles: Tile[][], paint: TilePatch[]): TilePatch[] => [
  ...paint,
  ...createGroundPatches(patchTiles(tiles, paint)),
];

export const createGroundedPatches = (
  tiles: Tile[][],
  layers: LayerPlacement[],
): TilePatch[] => addGroundPatches(tiles, createPaintPatches(layers));
