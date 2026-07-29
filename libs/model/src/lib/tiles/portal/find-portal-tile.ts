import type { Point } from '@mander/utils';
import { findTile } from '../find-tile';
import type { Level } from '../../level/level';
import { TILE_PORTAL } from './portal';

export const findPortalTile = (level: Level): Point | null =>
  findTile(level, TILE_PORTAL);
