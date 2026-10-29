import type { EnemyKind } from '@mander/model';
import { match } from 'ts-pattern';
import { SHOOTER_RELOAD_SECONDS } from '../consts';

const NO_RELOAD = 0;

export const getEnemyReloadSeconds = (kind: EnemyKind): number =>
  match(kind)
    .with('SHOOTER', () => SHOOTER_RELOAD_SECONDS)
    .otherwise(() => NO_RELOAD);
