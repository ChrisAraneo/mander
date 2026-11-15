import type { EnemyKind } from '@mander/model';
import { match } from 'ts-pattern';

export const toGroundEnemyKind = (
  isHorned: boolean,
  isFast: boolean,
  isShooter: boolean,
  isFreezing: boolean,
): EnemyKind =>
  match({ isHorned, isFast, isShooter, isFreezing })
    .with({ isShooter: true }, (): EnemyKind => 'SHOOTER')
    .with({ isFreezing: true }, (): EnemyKind => 'FREEZING')
    .with({ isFast: true }, (): EnemyKind => 'FAST')
    .with({ isHorned: true }, (): EnemyKind => 'HORNED')
    .otherwise((): EnemyKind => 'HOPPING');
