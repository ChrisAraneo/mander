import type { Level } from '@mander/model';
import { match, P } from 'ts-pattern';

import { overlapsSpike, stepEnemy } from '../physics';
import type { Enemy, Player } from '../state';
import { ENEMY_HEIGHT, ENEMY_WIDTH } from '../state';

const killEnemy = (enemy: Enemy): Enemy => ({
  ...enemy,
  velocity: {
    x: { ...enemy.velocity.x, current: 0 },
    y: { ...enemy.velocity.y, current: 0 },
  },
  timers: { ...enemy.timers, death: 0 },
});

const patrol = (
  level: Level,
  enemy: Enemy,
  player: Player,
  deltaSeconds: number,
): Enemy => {
  const stepped = stepEnemy(level, enemy, player, deltaSeconds);
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
    .with(P.number, (death): Enemy => ({
      ...enemy,
      timers: { ...enemy.timers, death: death + deltaSeconds },
    }))
    .otherwise(() => patrol(level, enemy, player, deltaSeconds));
