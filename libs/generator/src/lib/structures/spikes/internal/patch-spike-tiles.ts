import { patchTiles } from '../../patch-tiles';
import type { createSpikePatches } from './create-spike-patches';

export const patchSpikeTiles = ({
  tiles,
  patches,
}: ReturnType<typeof createSpikePatches>) => patchTiles(tiles, patches);
