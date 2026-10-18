import type { HazardKind, SpikeOrientation } from '@mander/model';
import { match } from 'ts-pattern';

export const toSpikeHazard = (orientation: SpikeOrientation): HazardKind =>
  match(orientation)
    .with('FLOOR', (): HazardKind => 'FLOOR_SPIKE')
    .with('CEILING', (): HazardKind => 'CEILING_SPIKE')
    .exhaustive((): HazardKind => 'FLOOR_SPIKE');
