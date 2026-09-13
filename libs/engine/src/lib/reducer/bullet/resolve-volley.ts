import type { Bullet, Enemy, FallingSpike } from '@mander/model';
import { concat, filter, find, map, reduce } from 'lodash-es';
import { match, P } from 'ts-pattern';

import type { GameLevel } from '../../types/game-level';
import { killEnemy } from '../enemy/kill-enemy';
import { isAlive } from '../player/is-alive';
import { isHittingEnemy } from './is-hitting-enemy';
import { isHittingFallingSpike } from './is-hitting-falling-spike';
import { shatterSpikeTile } from './shatter-spike-tile';
import { struckSpikeTile } from './struck-spike-tile';
import type { Volley } from './types/volley';

const { nonNullable } = P;

const victimOf = (bullet: Bullet, enemies: Enemy[]): Enemy | undefined =>
  find(enemies, (enemy) => isAlive(enemy) && isHittingEnemy(bullet, enemy));

const fallingSpikeOf = (
  bullet: Bullet,
  fallingSpikes: FallingSpike[],
): FallingSpike | undefined =>
  find(fallingSpikes, (spike) => isHittingFallingSpike(bullet, spike));

const struckDown = (volley: Volley, victim: Enemy): Volley => ({
  ...volley,
  enemies: map(volley.enemies, (enemy) =>
    enemy === victim ? killEnemy(enemy) : enemy,
  ),
});

const shotDown = (volley: Volley, target: FallingSpike): Volley => ({
  ...volley,
  fallingSpikes: filter(volley.fallingSpikes, (spike) => spike !== target),
});

const flewOn = (volley: Volley, bullet: Bullet): Volley => ({
  ...volley,
  bullets: concat(volley.bullets, bullet),
});

const spikeOrFlewOn = (volley: Volley, bullet: Bullet): Volley =>
  match(struckSpikeTile(volley.level, bullet))
    .with(nonNullable, (tile): Volley => ({
      ...volley,
      level: shatterSpikeTile(volley.level, tile),
    }))
    .otherwise(() =>
      match(fallingSpikeOf(bullet, volley.fallingSpikes))
        .with(nonNullable, (target) => shotDown(volley, target))
        .otherwise(() => flewOn(volley, bullet)),
    );

export const resolveVolley = (
  bullets: Bullet[],
  enemies: Enemy[],
  fallingSpikes: FallingSpike[],
  level: GameLevel,
): Volley =>
  reduce(
    bullets,
    (volley, bullet): Volley =>
      match(victimOf(bullet, volley.enemies))
        .with(nonNullable, (victim) => struckDown(volley, victim))
        .otherwise(() => spikeOrFlewOn(volley, bullet)),
    { bullets: [], enemies, fallingSpikes, level } as Volley,
  );
