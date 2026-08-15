import type { Enemy, Fireball } from '@mander/model';
import { map, some } from 'lodash-es';
import { match } from 'ts-pattern';

import { ENEMY_HEIGHT, ENEMY_HITBOX_INSET, ENEMY_WIDTH } from '../enemy/consts';
import { killEnemy } from '../enemy/kill-enemy';
import { isAlive } from '../player/is-alive';
import { FIREBALL_HITBOX_INSET, FIREBALL_SIZE } from './consts';
import { playerFireballPosition } from './player-fireball-position';

const isHittingEnemy = (fireball: Fireball, enemy: Enemy): boolean => {
  const centre = playerFireballPosition(fireball);
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

const isBurned = (fireballs: Fireball[], enemy: Enemy): boolean =>
  isAlive(enemy) &&
  some(fireballs, (fireball) => isHittingEnemy(fireball, enemy));

export const burnEnemies = (fireballs: Fireball[], enemies: Enemy[]): Enemy[] =>
  map(enemies, (enemy) =>
    match(isBurned(fireballs, enemy))
      .with(true, () => killEnemy(enemy))
      .otherwise(() => enemy),
  );
