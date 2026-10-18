import type { Bullet } from '@mander/model';
import { match, P } from 'ts-pattern';
import type { Volley } from '../types/volley';
import { findBulletVictim } from './find-bullet-victim';
import { patchVolleyAfterMiss } from './patch-volley-after-miss';
import { patchVolleyVictim } from './patch-volley-victim';

const { nonNullable } = P;

export const patchVolleyWithBullet = (volley: Volley, bullet: Bullet): Volley =>
  match(findBulletVictim(bullet, volley.enemies))
    .with(nonNullable, (victim) => patchVolleyVictim(volley, victim))
    .otherwise(() => patchVolleyAfterMiss(volley, bullet));
