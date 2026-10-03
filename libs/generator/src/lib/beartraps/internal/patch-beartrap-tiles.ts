import { patchTiles } from '../../structures/patch-tiles';
import type { createBeartrapPatches } from './create-beartrap-patches';

export const patchBeartrapTiles = ({
  tiles,
  patches,
}: ReturnType<typeof createBeartrapPatches>) => patchTiles(tiles, patches);
