import type { Tile } from '@mander/model';
import { formatTilesSeed } from '../../format-tiles-seed';

export const formatBeartrapSeed = (
  tiles: Tile[][],
  levelNumber: number,
): string => `beartrap#${levelNumber}#${formatTilesSeed(tiles)}`;
