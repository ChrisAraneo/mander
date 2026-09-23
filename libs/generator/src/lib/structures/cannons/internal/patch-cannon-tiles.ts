import { patchTiles } from '../../patch-tiles';
import type { createCannonPatches } from './create-cannon-patches';

export const patchCannonTiles = ({
  tiles,
  patches,
}: ReturnType<typeof createCannonPatches>) => patchTiles(tiles, patches);
