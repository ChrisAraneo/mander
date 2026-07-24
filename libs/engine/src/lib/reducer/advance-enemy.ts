import type { Level } from '@mander/generator';
import { match, P } from 'ts-pattern';

import { overlapsSpike, stepEnemy } from '../physics';
import type { Enemy, Player } from '../state';
import { ENEMY_HEIGHT, ENEMY_WIDTH } from '../state';

const killEnemy = (enemy: Enemy): Enemy => ({
  ...enemy,
  vx: 0,
  vy: 0,
  dyingFor: 0,
});

const patrol = (
  level: Level,
  enemy: Enemy,
  player: Player,
  deltaSeconds: number,
): Enemy => {
  const stepped = stepEnemy(level, enemy, player, deltaSeconds);
  return match(
    overlapsSpike(level, stepped.x, stepped.y, ENEMY_WIDTH, ENEMY_HEIGHT),
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
  match(enemy.dyingFor)
    .with(
      P.number,
      (dyingFor): Enemy => ({ ...enemy, dyingFor: dyingFor + deltaSeconds }),
    )
    .otherwise(() => patrol(level, enemy, player, deltaSeconds));
