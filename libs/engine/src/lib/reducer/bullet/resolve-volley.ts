import type { Bullet, Enemy } from '@mander/model';
import { concat, find, map, reduce } from 'lodash-es';
import { match, P } from 'ts-pattern';

import { killEnemy } from '../enemy/kill-enemy';
import { isAlive } from '../player/is-alive';
import { isHittingEnemy } from './is-hitting-enemy';
import type { Volley } from './types/volley';

const victimOf = (bullet: Bullet, enemies: Enemy[]): Enemy | undefined =>
  find(enemies, (enemy) => isAlive(enemy) && isHittingEnemy(bullet, enemy));

const struckDown = (volley: Volley, victim: Enemy): Volley => ({
  bullets: volley.bullets,
  enemies: map(volley.enemies, (enemy) =>
    enemy === victim ? killEnemy(enemy) : enemy,
  ),
});

const flewOn = (volley: Volley, bullet: Bullet): Volley => ({
  ...volley,
  bullets: concat(volley.bullets, bullet),
});

export const resolveVolley = (bullets: Bullet[], enemies: Enemy[]): Volley =>
  reduce(
    bullets,
    (volley, bullet): Volley =>
      match(victimOf(bullet, volley.enemies))
        .with(P.nonNullable, (victim) => struckDown(volley, victim))
        .otherwise(() => flewOn(volley, bullet)),
    { bullets: [], enemies } as Volley,
  );
