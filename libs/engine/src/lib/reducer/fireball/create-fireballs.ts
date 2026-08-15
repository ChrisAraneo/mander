import {
  type Fireball,
  type FireballSpin,
  findFireballTiles,
  type Level,
  TILE_SIZE,
} from '@mander/model';
import { createRandom } from '@mander/utils';
import type { Point } from '@mander/utils';
import { map } from 'lodash-es';
import { match } from 'ts-pattern';

import {
  FIREBALL_ANTICLOCKWISE_CHANCE,
  FIREBALL_STAGGER_ANGLE,
  FIREBALL_STAGGER_STEPS,
} from './consts';

const startingAngle = (tile: Point): number =>
  ((tile.x + tile.y) % FIREBALL_STAGGER_STEPS) * FIREBALL_STAGGER_ANGLE;

const spinFor = (isAnticlockwise: boolean): FireballSpin =>
  match(isAnticlockwise)
    .with(true, (): FireballSpin => 'ANTICLOCKWISE')
    .otherwise((): FireballSpin => 'CLOCKWISE');

export const createFireballs = (level: Level): Fireball[] => {
  const random = createRandom(`${level.seed}#fireballs`);

  return map(findFireballTiles(level), (tile): Fireball => ({
    spin: spinFor(random.chance(FIREBALL_ANTICLOCKWISE_CHANCE)),
    origin: {
      x: tile.x * TILE_SIZE + TILE_SIZE / 2,
      y: tile.y * TILE_SIZE + TILE_SIZE / 2,
    },
    angle: startingAngle(tile),
  }));
};
