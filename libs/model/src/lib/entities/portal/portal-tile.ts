import type { Point } from '@mander/utils';
import { findTile } from '../../level/find-tile';
import type { Level } from '../../level/level';
import { TILE_PORTAL } from '../../tiles/portal';

export const portalTile = (level: Level): Point | null =>
  findTile(level, TILE_PORTAL);
