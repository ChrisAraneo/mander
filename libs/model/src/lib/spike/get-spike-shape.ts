import { match } from 'ts-pattern';

import type { Level } from '../level/level';
import { getSpikeOrientation } from './get-spike-orientation';
import { isSpikeWithOrientation } from './is-spike-with-orientation';
import type { SpikeShape } from './spike-shape';

export const getSpikeShape = (
  level: Level,
  tileX: number,
  tileY: number,
): SpikeShape => {
  const orientation = getSpikeOrientation(level, tileX, tileY);

  return match(
    isSpikeWithOrientation(level, tileX - 1, tileY, orientation) ||
      isSpikeWithOrientation(level, tileX + 1, tileY, orientation),
  )
    .with(true, (): SpikeShape => 'STRIP')
    .otherwise((): SpikeShape => 'SINGLE');
};
