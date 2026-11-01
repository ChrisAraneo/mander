import {
  type Fireball,
  type FireballKind,
  type Point,
  TILE_SIZE,
} from '@mander/model';
import { isRollUnder } from '../../../random/is-roll-under';
import type { Random } from '../../../random/types/random';
import { FIREBALL_ANTICLOCKWISE_CHANCE } from '../consts';
import { computeFireballStartingAngle } from './compute-fireball-starting-angle';
import { toFireballSpin } from './to-fireball-spin';

export const createSpinningFireball = (
  kind: FireballKind,
  tile: Point,
  random: Random,
): Fireball => ({
  kind,
  spin: toFireballSpin(isRollUnder(FIREBALL_ANTICLOCKWISE_CHANCE, random)),
  origin: {
    x: tile.x * TILE_SIZE + TILE_SIZE / 2,
    y: tile.y * TILE_SIZE + TILE_SIZE / 2,
  },
  angle: computeFireballStartingAngle(tile),
});
