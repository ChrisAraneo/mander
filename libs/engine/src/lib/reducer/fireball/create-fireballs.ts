import {
  type Fireball,
  findFireballTiles,
  findIceballTiles,
  findPinkballTiles,
  type Level,
} from '@mander/model';
import { flatMap, map } from 'lodash-es';
import { pipe } from 'remeda';
import { createRandom } from '../../random/create-random';
import { createGermPair } from './internal/create-germ-pair';
import { createSpinningFireball } from './internal/create-spinning-fireball';

export const createFireballs = (level: Level): Fireball[] =>
  pipe(`${level.seed}#fireballs`, createRandom, (random) => [
    ...map(findFireballTiles(level), (tile) =>
      createSpinningFireball('FIRE', tile, random),
    ),
    ...map(findIceballTiles(level), (tile) =>
      createSpinningFireball('ICE', tile, random),
    ),
    ...flatMap(findPinkballTiles(level), (tile) =>
      createGermPair(tile, random),
    ),
  ]);
