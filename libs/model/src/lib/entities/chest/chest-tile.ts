import type { Point } from '@mander/utils';
import { findTile } from '../../level/find-tile';
import type { Level } from '../../level/level';
import { TILE_CHEST } from '../../tiles/chest';

export const chestTile = (level: Level): Point | null =>
  findTile(level, TILE_CHEST);
