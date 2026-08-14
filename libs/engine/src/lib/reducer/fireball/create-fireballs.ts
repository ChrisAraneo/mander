import {
  type Fireball,
  findFireballTiles,
  type Level,
  TILE_SIZE,
} from '@mander/model';
import type { Point } from '@mander/utils';
import { map } from 'lodash-es';

import { FIREBALL_STAGGER_ANGLE, FIREBALL_STAGGER_STEPS } from './consts';

const startingAngle = (tile: Point): number =>
  ((tile.x + tile.y) % FIREBALL_STAGGER_STEPS) * FIREBALL_STAGGER_ANGLE;

export const createFireballs = (level: Level): Fireball[] =>
  map(findFireballTiles(level), (tile): Fireball => ({
    origin: {
      x: tile.x * TILE_SIZE + TILE_SIZE / 2,
      y: tile.y * TILE_SIZE + TILE_SIZE / 2,
    },
    angle: startingAngle(tile),
  }));
