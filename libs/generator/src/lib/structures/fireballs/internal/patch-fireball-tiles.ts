import { patchTiles } from '../../patch-tiles';
import type { createFireballPatches } from './create-fireball-patches';

export const patchFireballTiles = ({
  tiles,
  patches,
}: ReturnType<typeof createFireballPatches>) => patchTiles(tiles, patches);
