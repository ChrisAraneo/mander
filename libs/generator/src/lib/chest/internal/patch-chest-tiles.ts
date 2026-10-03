import { patchTiles } from '../../structures/patch-tiles';
import type { createChestPatches } from './create-chest-patches';

export const patchChestTiles = ({
  tiles,
  patches,
}: ReturnType<typeof createChestPatches>) => patchTiles(tiles, patches);
