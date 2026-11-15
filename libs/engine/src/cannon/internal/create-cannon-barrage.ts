import { compact, map } from 'lodash-es';
import type { Barrage } from '../types/barrage';
import type { CannonShots } from './types/cannon-shots';

export const createCannonBarrage = ({ shots }: CannonShots): Barrage => ({
  cannons: map(shots, (shot) => shot.cannon),
  cannonballs: compact(map(shots, (shot) => shot.cannonball)),
});
