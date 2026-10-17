import {
  type Fireball,
  findFireballTiles,
  type Level,
  TILE_SIZE,
} from '@mander/model';
import { chain, createRandom } from '@mander/utils';
import { map } from 'lodash-es';
import { FIREBALL_ANTICLOCKWISE_CHANCE } from './consts';
import { computeFireballStartingAngle } from './internal/compute-fireball-starting-angle';
import { toFireballSpin } from './internal/to-fireball-spin';

export const createFireballs = (level: Level): Fireball[] =>
  chain(createRandom(`${level.seed}#fireballs`))
    .thru((random) =>
      map(findFireballTiles(level), (tile): Fireball => ({
        spin: toFireballSpin(random.isRollUnder(FIREBALL_ANTICLOCKWISE_CHANCE)),
        origin: {
          x: tile.x * TILE_SIZE + TILE_SIZE / 2,
          y: tile.y * TILE_SIZE + TILE_SIZE / 2,
        },
        angle: computeFireballStartingAngle(tile),
      })),
    )
    .value();
