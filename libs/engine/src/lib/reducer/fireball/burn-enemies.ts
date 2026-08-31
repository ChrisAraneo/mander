import { type Enemy, type Fireball, MAX_TICK_SECONDS } from '@mander/model';
import { chain, type Point } from '@mander/utils';
import { map, some, times } from 'lodash-es';
import { match } from 'ts-pattern';

import { ENEMY_HEIGHT, ENEMY_HITBOX_INSET, ENEMY_WIDTH } from '../enemy/consts';
import { killEnemy } from '../enemy/kill-enemy';
import { isAlive } from '../player/is-alive';
import {
  FIREBALL_HITBOX_INSET,
  FIREBALL_SIZE,
  PLAYER_FIREBALL_ANGULAR_SPEED,
  PLAYER_FIREBALL_ORBIT_RADIUS,
  PLAYER_FIREBALL_SWEEP_STEP,
} from './consts';
import { playerFireballPosition } from './player-fireball-position';
import { spinDirection } from './spin-direction';

const isHittingEnemy = (centre: Point, enemy: Enemy): boolean => {
  const reach = FIREBALL_SIZE / 2 - FIREBALL_HITBOX_INSET;

  const enemyLeft = enemy.position.x + ENEMY_HITBOX_INSET;
  const enemyRight = enemy.position.x + ENEMY_WIDTH - ENEMY_HITBOX_INSET;
  const enemyTop = enemy.position.y + ENEMY_HITBOX_INSET;
  const enemyBottom = enemy.position.y + ENEMY_HEIGHT - ENEMY_HITBOX_INSET;

  return (
    centre.x - reach < enemyRight &&
    centre.x + reach > enemyLeft &&
    centre.y - reach < enemyBottom &&
    centre.y + reach > enemyTop
  );
};

const sweptSteps = (sweptAngle: number): number =>
  Math.max(
    1,
    Math.ceil(
      (sweptAngle * PLAYER_FIREBALL_ORBIT_RADIUS) / PLAYER_FIREBALL_SWEEP_STEP,
    ),
  );

const sweptCentres = (
  fireball: Fireball,
  elapsedSeconds: number,
): readonly Point[] =>
  chain(
    PLAYER_FIREBALL_ANGULAR_SPEED * Math.min(elapsedSeconds, MAX_TICK_SECONDS),
  )
    .thru((sweptAngle) => ({ sweptAngle, steps: sweptSteps(sweptAngle) }))
    .thru(({ sweptAngle, steps }) =>
      times(steps + 1, (step) =>
        playerFireballPosition({
          ...fireball,
          angle:
            fireball.angle -
            spinDirection(fireball.spin) * sweptAngle * (step / steps),
        }),
      ),
    )
    .value();

const isBurned = (
  fireballs: Fireball[],
  enemy: Enemy,
  elapsedSeconds: number,
): boolean =>
  isAlive(enemy) &&
  some(fireballs, (fireball) =>
    some(sweptCentres(fireball, elapsedSeconds), (centre) =>
      isHittingEnemy(centre, enemy),
    ),
  );

export const burnEnemies = (
  fireballs: Fireball[],
  enemies: Enemy[],
  elapsedSeconds = 0,
): Enemy[] =>
  map(enemies, (enemy) =>
    match(isBurned(fireballs, enemy, elapsedSeconds))
      .with(true, () => killEnemy(enemy))
      .otherwise(() => enemy),
  );
