import { compact, map } from 'lodash-es';
import type { Blizzard } from '../types/blizzard';
import type { FreezingShot } from './types/freezing-shot';

export const createBlizzard = (shots: FreezingShot[]): Blizzard => ({
  enemies: map(shots, (shot) => shot.enemy),
  snowballs: compact(map(shots, (shot) => shot.snowball)),
});
