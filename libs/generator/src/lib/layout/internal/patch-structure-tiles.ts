import type { Layers } from '@mander/model';
import { patchTiles } from '../../structures/patch-tiles';
import type { StructurePatch } from './types/structure-patch';

export const patchStructureTiles = ({
  tiles,
  frontPatches,
  backPatches,
}: StructurePatch): Layers => ({
  tiles: patchTiles(tiles, frontPatches),
  backTiles: patchTiles(tiles, backPatches),
});
