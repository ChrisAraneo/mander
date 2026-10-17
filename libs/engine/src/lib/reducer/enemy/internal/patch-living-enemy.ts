import type { Enemy, Level, Player } from '@mander/model';
import { match } from 'ts-pattern';
import { stepBeartrap } from '../step-beartrap';
import { stepEnemy } from '../step-enemy';
import { patchFlyingEnemy } from './patch-flying-enemy';

export const patchLivingEnemy = (
  level: Level,
  enemy: Enemy,
  player: Player,
  deltaSeconds: number,
): Enemy =>
  match(enemy.kind)
    .with('HOPPING', () => stepEnemy(level, enemy, player, deltaSeconds))
    .with('HORNED', () => stepEnemy(level, enemy, player, deltaSeconds))
    .with('FLYING', () => patchFlyingEnemy(level, enemy, deltaSeconds))
    .with('BEARTRAP', () => stepBeartrap(level, enemy, player, deltaSeconds))
    .exhaustive(() => stepEnemy(level, enemy, player, deltaSeconds));
