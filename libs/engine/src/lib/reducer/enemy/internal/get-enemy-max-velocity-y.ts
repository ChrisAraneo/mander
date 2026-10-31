import type { EnemyKind } from '@mander/model';
import { match } from 'ts-pattern';
import {
  ENEMY_JUMP_VELOCITY,
  FLYING_ENEMY_MOVE_SPEED,
  HORNED_ENEMY_JUMP_VELOCITY,
} from '../consts';

export const getEnemyMaxVelocityY = (kind: EnemyKind): number =>
  match(kind)
    .with('HOPPING', () => ENEMY_JUMP_VELOCITY)
    .with('HORNED', () => HORNED_ENEMY_JUMP_VELOCITY)
    .with('FAST', () => HORNED_ENEMY_JUMP_VELOCITY)
    .with('SHOOTER', () => HORNED_ENEMY_JUMP_VELOCITY)
    .with('FREEZING', () => HORNED_ENEMY_JUMP_VELOCITY)
    .with('FLYING', () => FLYING_ENEMY_MOVE_SPEED)
    .with('BEARTRAP', () => ENEMY_JUMP_VELOCITY)
    .exhaustive(() => ENEMY_JUMP_VELOCITY);
