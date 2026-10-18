import type { HazardKind } from '@mander/model';
import { match } from 'ts-pattern';
import type { ItemArt } from '../types/item-art';

export const createWardArt = (hazard: HazardKind): ItemArt =>
  match(hazard)
    .with('CEILING_SPIKE', (): ItemArt => ({ kind: 'HELMET' }))
    .with('FLOOR_SPIKE', (): ItemArt => ({ kind: 'BOOTS' }))
    .exhaustive();
