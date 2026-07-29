import type { Point } from '@mander/utils';
import { findTile } from '../find-tile';
import type { Level } from '../../level/level';
import { TILE_CHEST } from './chest';

export const findChestTile = (level: Level): Point | null =>
  findTile(level, TILE_CHEST);
