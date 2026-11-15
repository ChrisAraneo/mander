import type { Bullet, FallingSpike } from '@mander/model';
import { find } from 'lodash-es';
import { isHittingFallingSpike } from './is-hitting-falling-spike';

export const findStruckFallingSpike = (
  bullet: Bullet,
  fallingSpikes: FallingSpike[],
): FallingSpike | undefined =>
  find(fallingSpikes, (spike) => isHittingFallingSpike(bullet, spike));
