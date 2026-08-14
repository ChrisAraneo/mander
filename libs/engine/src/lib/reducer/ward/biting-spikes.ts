import type { HazardKind, Item, SpikeOrientation } from '@mander/model';
import { filter } from 'lodash-es';
import { match } from 'ts-pattern';

import { SPIKE_ORIENTATIONS } from '../spike/overlaps-spike';
import { isWarded } from './is-warded';

const hazardOf = (orientation: SpikeOrientation): HazardKind =>
  match(orientation)
    .with('CEILING', (): HazardKind => 'CEILING_SPIKE')
    .otherwise((): HazardKind => 'FLOOR_SPIKE');

export const bitingSpikes = (inventory: readonly Item[]): SpikeOrientation[] =>
  filter(
    SPIKE_ORIENTATIONS,
    (orientation) => !isWarded(inventory, hazardOf(orientation)),
  );
