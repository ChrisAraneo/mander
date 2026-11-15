import type { Bullet } from '@mander/model';
import { concat } from 'lodash-es';
import type { Volley } from '../types/volley';

export const addVolleyBullet = (volley: Volley, bullet: Bullet): Volley => ({
  ...volley,
  bullets: concat(volley.bullets, bullet),
});
