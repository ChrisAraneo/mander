import type { Enemy } from './enemy';
import type { Player } from './player';

export const isAlive = (body: Player | Enemy): boolean =>
  body.dyingFor === null;
