import { patchTiles } from '../../patch-tiles';
import type { createKeyPatches } from './create-key-patches';

export const patchKeyTiles = ({
  tiles,
  patches,
}: ReturnType<typeof createKeyPatches>) => patchTiles(tiles, patches);
