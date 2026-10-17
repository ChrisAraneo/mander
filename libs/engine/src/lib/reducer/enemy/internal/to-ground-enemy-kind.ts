import type { EnemyKind } from '@mander/model';
import { match } from 'ts-pattern';

export const toGroundEnemyKind = (isHorned: boolean): EnemyKind =>
  match(isHorned)
    .with(true, (): EnemyKind => 'HORNED')
    .otherwise((): EnemyKind => 'HOPPING');
