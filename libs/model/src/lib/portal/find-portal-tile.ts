import type { Point } from '@mander/utils';
import { match, P } from 'ts-pattern';

import { findTile } from '../tile/find-tile';
import type { Level } from '../level/level';
import { TILE_PORTAL } from './portal';
import { findPortalBottomTile } from './find-portal-bottom-tile';

const { nullish } = P;

export const findPortalTile = (level: Level): Point | null =>
  match(findTile(level, TILE_PORTAL))
    .with(nullish, () => null)
    .otherwise((top) => findPortalBottomTile(level, top));
