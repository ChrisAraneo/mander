import type { Fireball } from '@mander/model';

export const isIceball = (fireball: Fireball): boolean =>
  fireball.kind === 'ICE';
