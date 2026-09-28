import type { Tile } from '@mander/model';
import { formatTilesSeed } from '../../format-tiles-seed';

export const formatSpikeSeed = (tiles: Tile[][], levelNumber: number): string =>
  `${levelNumber}#${formatTilesSeed(tiles)}`;
