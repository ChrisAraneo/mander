import { compact, map } from 'lodash-es';
import type { Salvo } from '../types/salvo';
import type { ShooterShot } from './types/shooter-shot';

export const createSalvo = (shots: ShooterShot[]): Salvo => ({
  enemies: map(shots, (shot) => shot.enemy),
  cannonballs: compact(map(shots, (shot) => shot.cannonball)),
});
