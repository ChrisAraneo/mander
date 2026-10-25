import {
  type Fireball,
  findFireballTiles,
  type Level,
  TILE_SIZE,
} from '@mander/model';
import { map } from 'lodash-es';
import { pipe } from 'remeda';
import { createRandom } from '../../random/create-random';
import { isRollUnder } from '../../random/is-roll-under';
import { FIREBALL_ANTICLOCKWISE_CHANCE } from './consts';
import { computeFireballStartingAngle } from './internal/compute-fireball-starting-angle';
import { toFireballSpin } from './internal/to-fireball-spin';

export const createFireballs = (level: Level): Fireball[] =>
  pipe(`${level.seed}#fireballs`, createRandom, (random) =>
    map(findFireballTiles(level), (tile): Fireball => ({
      spin: toFireballSpin(isRollUnder(FIREBALL_ANTICLOCKWISE_CHANCE, random)),
      origin: {
        x: tile.x * TILE_SIZE + TILE_SIZE / 2,
        y: tile.y * TILE_SIZE + TILE_SIZE / 2,
      },
      angle: computeFireballStartingAngle(tile),
    })),
  );
