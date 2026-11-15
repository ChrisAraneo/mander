import type { CannonKind } from '@mander/model';
import { match } from 'ts-pattern';
import { CANNON_RELOAD_SECONDS, TRIPLE_CANNON_RELOAD_SECONDS } from '../consts';

export const getCannonReloadSeconds = (kind: CannonKind): number =>
  match(kind)
    .with('REGULAR', () => CANNON_RELOAD_SECONDS)
    .with('TRIPLE', () => TRIPLE_CANNON_RELOAD_SECONDS)
    .exhaustive();
