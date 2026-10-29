import type { EnemyKind } from '@mander/model';
import { match } from 'ts-pattern';
import {
  ENEMY_MOVE_SPEED,
  FAST_ENEMY_MOVE_SPEED,
  SHOOTER_ENEMY_MOVE_SPEED,
} from '../consts';

export const getEnemyMoveSpeed = (kind: EnemyKind): number =>
  match(kind)
    .with('HOPPING', () => ENEMY_MOVE_SPEED)
    .with('HORNED', () => ENEMY_MOVE_SPEED)
    .with('FAST', () => FAST_ENEMY_MOVE_SPEED)
    .with('SHOOTER', () => SHOOTER_ENEMY_MOVE_SPEED)
    .with('FLYING', () => 0)
    .with('BEARTRAP', () => ENEMY_MOVE_SPEED)
    .exhaustive(() => ENEMY_MOVE_SPEED);
