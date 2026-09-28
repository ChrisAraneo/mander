import { patchTiles } from '../../patch-tiles';
import type { createGemPatches } from './create-gem-patches';

export const patchGemTiles = ({
  tiles,
  patches,
}: ReturnType<typeof createGemPatches>) => patchTiles(tiles, patches);
