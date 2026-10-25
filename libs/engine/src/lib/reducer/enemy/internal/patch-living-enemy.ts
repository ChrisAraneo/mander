import type { Enemy, Level, Player } from '@mander/model';
import { match } from 'ts-pattern';
import { nextBeartrap } from '../next-beartrap';
import { nextEnemy } from '../next-enemy';
import { patchFlyingEnemy } from './patch-flying-enemy';

export const patchLivingEnemy = (
  level: Level,
  enemy: Enemy,
  player: Player,
  deltaSeconds: number,
): Enemy =>
  match(enemy.kind)
    .with('HOPPING', () => nextEnemy(level, enemy, player, deltaSeconds))
    .with('HORNED', () => nextEnemy(level, enemy, player, deltaSeconds))
    .with('FLYING', () => patchFlyingEnemy(level, enemy, deltaSeconds))
    .with('BEARTRAP', () => nextBeartrap(level, enemy, player, deltaSeconds))
    .exhaustive(() => nextEnemy(level, enemy, player, deltaSeconds));
