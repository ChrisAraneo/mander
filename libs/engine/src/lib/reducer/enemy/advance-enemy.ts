import type { Enemy, Level, Player } from '@mander/model';
import { match, P } from 'ts-pattern';

import { overlapsSpike } from '../spike/overlaps-spike';
import { ENEMY_HEIGHT, ENEMY_WIDTH } from './consts';
import { killEnemy } from './kill-enemy';
import { stepDyingEnemy } from './step-dying-enemy';
import { stepEnemy } from './step-enemy';
import { stepFlyingEnemy } from './step-flying-enemy';

const { number } = P;

const moveAlive = (
  level: Level,
  enemy: Enemy,
  player: Player,
  deltaSeconds: number,
): Enemy =>
  match(enemy.kind)
    .with('FLYING', () => stepFlyingEnemy(level, enemy, deltaSeconds))
    .otherwise(() => stepEnemy(level, enemy, player, deltaSeconds));

const patrol = (
  level: Level,
  enemy: Enemy,
  player: Player,
  deltaSeconds: number,
): Enemy => {
  const stepped = moveAlive(level, enemy, player, deltaSeconds);
  return match(
    overlapsSpike(
      level,
      stepped.position.x,
      stepped.position.y,
      ENEMY_WIDTH,
      ENEMY_HEIGHT,
    ),
  )
    .with(true, () => killEnemy(stepped))
    .otherwise(() => stepped);
};

export const advanceEnemy = (
  level: Level,
  enemy: Enemy,
  player: Player,
  deltaSeconds: number,
): Enemy =>
  match(enemy.timers.death)
    .with(number, (death): Enemy => {
      const fallen = stepDyingEnemy(level, enemy, deltaSeconds);
      return {
        ...fallen,
        timers: { ...fallen.timers, death: death + deltaSeconds },
      };
    })
    .otherwise(() => patrol(level, enemy, player, deltaSeconds));
