import { type Random } from '@mander/common';
import {
  type Fireball,
  findFireballTiles,
  findIceballTiles,
  findPinkballTiles,
  type Level,
} from '@mander/model';
import { flatMap, map } from 'lodash-es';
import { createPinkballs } from './create-pinkballs';
import { createSpinningFireball } from './create-spinning-fireball';

export const createLevelFireballs = (
  level: Level,
  random: Random,
): Fireball[] => [
  ...map(findFireballTiles(level), (tile) =>
    createSpinningFireball('FIRE', tile, random),
  ),
  ...map(findIceballTiles(level), (tile) =>
    createSpinningFireball('ICE', tile, random),
  ),
  ...flatMap(findPinkballTiles(level), (tile) => createPinkballs(tile, random)),
];
