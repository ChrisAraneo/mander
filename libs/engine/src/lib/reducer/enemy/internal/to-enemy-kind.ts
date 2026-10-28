import type { EnemyKind } from '@mander/model';
import { match } from 'ts-pattern';
import { toGroundEnemyKind } from './to-ground-enemy-kind';

export const toEnemyKind = (
  isAirborne: boolean,
  isHorned: boolean,
  isFast: boolean,
): EnemyKind =>
  match(isAirborne)
    .with(true, (): EnemyKind => 'FLYING')
    .otherwise(() => toGroundEnemyKind(isHorned, isFast));
