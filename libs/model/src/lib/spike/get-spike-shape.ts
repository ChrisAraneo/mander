import { pipe } from 'remeda';
import { match } from 'ts-pattern';
import type { Level } from '../types/level';
import { getSpikeOrientation } from './get-spike-orientation';
import { isSpikeWithOrientation } from './is-spike-with-orientation';
import type { SpikeShape } from './types/spike-shape';

export const getSpikeShape = (
  level: Level,
  tileX: number,
  tileY: number,
): SpikeShape =>
  pipe(
    getSpikeOrientation(level, tileX, tileY),
    (orientation) =>
      isSpikeWithOrientation(level, tileX - 1, tileY, orientation) ||
      isSpikeWithOrientation(level, tileX + 1, tileY, orientation),
    (isStrip) =>
      match(isStrip)
        .with(true, (): SpikeShape => 'STRIP')
        .otherwise((): SpikeShape => 'SINGLE'),
  );
