import { patchTiles } from '../../patch-tiles';
import type { createPlayerSpawnPatches } from './create-player-spawn-patches';

export const patchPlayerSpawnTiles = ({
  tiles,
  patches,
}: ReturnType<typeof createPlayerSpawnPatches>) => patchTiles(tiles, patches);
