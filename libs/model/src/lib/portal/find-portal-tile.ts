import { match, P } from 'ts-pattern';
import { findTile } from '../tile/find-tile';
import type { Level } from '../types/level';
import type { Point } from '../types/point';
import { findPortalBottomTile } from './find-portal-bottom-tile';
import { TILE_PORTAL } from './tile-portal';

const { nullish } = P;

export const findPortalTile = (level: Level): Point | null =>
  match(findTile(level, TILE_PORTAL))
    .with(nullish, () => null)
    .otherwise((top) => findPortalBottomTile(level, top));
