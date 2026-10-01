import { patchTiles } from '../../patch-tiles';
import type { createStructurePatches } from './create-structure-patches';

export const patchStructureTiles = ({
  tiles,
  frontPatches,
  backPatches,
}: ReturnType<typeof createStructurePatches>) => ({
  tiles: patchTiles(tiles, frontPatches),
  backTiles: patchTiles(tiles, backPatches),
});
