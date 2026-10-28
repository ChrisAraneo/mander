import type { EnemyKind } from '@mander/model';
import { match } from 'ts-pattern';

export const toGroundEnemyKind = (
  isHorned: boolean,
  isFast: boolean,
): EnemyKind =>
  match({ isHorned, isFast })
    .with({ isFast: true }, (): EnemyKind => 'FAST')
    .with({ isHorned: true }, (): EnemyKind => 'HORNED')
    .otherwise((): EnemyKind => 'HOPPING');
