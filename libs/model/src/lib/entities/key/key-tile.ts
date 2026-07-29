import type { Point } from '@mander/utils';
import { findTile } from '../../level/find-tile';
import type { Level } from '../../level/level';
import { TILE_KEY } from '../../tiles/key';

export const keyTile = (level: Level): Point | null =>
  findTile(level, TILE_KEY);
