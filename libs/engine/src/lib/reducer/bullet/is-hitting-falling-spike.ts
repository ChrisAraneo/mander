import type { Bullet, FallingSpike } from '@mander/model';

import {
  FALLING_SPIKE_HEIGHT,
  FALLING_SPIKE_INSET_X,
  FALLING_SPIKE_WIDTH,
} from '../falling-spike/consts';
import { bulletBox } from './bullet-box';
import { overlapsBox } from './overlaps-box';

export const isHittingFallingSpike = (
  bullet: Bullet,
  spike: FallingSpike,
): boolean =>
  overlapsBox(bulletBox(bullet), {
    x: spike.position.x + FALLING_SPIKE_INSET_X,
    y: spike.position.y,
    width: FALLING_SPIKE_WIDTH,
    height: FALLING_SPIKE_HEIGHT,
  });
