import { match } from 'ts-pattern';
import { SPIKE_PRONGS } from '../consts';
import type { SpikeShape } from '../types/spike-shape';

export const toProngCount = (shape: SpikeShape): number =>
  match(shape)
    .with('SINGLE', () => 1)
    .with('STRIP', () => SPIKE_PRONGS)
    .exhaustive();
