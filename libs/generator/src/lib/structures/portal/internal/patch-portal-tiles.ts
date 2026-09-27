import { patchTiles } from '../../patch-tiles';
import type { createPortalPatches } from './create-portal-patches';

export const patchPortalTiles = ({
  tiles,
  patches,
}: ReturnType<typeof createPortalPatches>) => patchTiles(tiles, patches);
