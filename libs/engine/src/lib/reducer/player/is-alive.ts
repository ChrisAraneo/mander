import type { Enemy, Player } from '@mander/model';

export const isAlive = (body: Player | Enemy): boolean =>
  body.timers.death === null;
