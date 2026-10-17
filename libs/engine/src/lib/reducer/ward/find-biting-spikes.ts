import type { Item, SpikeOrientation } from '@mander/model';
import { filter } from 'lodash-es';
import { SPIKE_ORIENTATIONS } from '../spike/consts';
import { toSpikeHazard } from './internal/to-spike-hazard';
import { isWarded } from './is-warded';

export const findBitingSpikes = (
  inventory: readonly Item[],
): SpikeOrientation[] =>
  filter(
    SPIKE_ORIENTATIONS,
    (orientation) => !isWarded(inventory, toSpikeHazard(orientation)),
  );
