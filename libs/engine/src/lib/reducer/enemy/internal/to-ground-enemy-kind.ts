import type { EnemyKind } from '@mander/model';
import { match } from 'ts-pattern';

export const toGroundEnemyKind = (
  isHorned: boolean,
  isFast: boolean,
  isShooter: boolean,
): EnemyKind =>
  match({ isHorned, isFast, isShooter })
    .with({ isShooter: true }, (): EnemyKind => 'SHOOTER')
    .with({ isFast: true }, (): EnemyKind => 'FAST')
    .with({ isHorned: true }, (): EnemyKind => 'HORNED')
    .otherwise((): EnemyKind => 'HOPPING');
