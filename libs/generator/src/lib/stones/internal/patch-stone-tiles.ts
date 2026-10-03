import { patchTiles } from '../../structures/patch-tiles';
import type { createStonePatches } from './create-stone-patches';

export const patchStoneTiles = ({
  tiles,
  patches,
}: ReturnType<typeof createStonePatches>) => patchTiles(tiles, patches);
