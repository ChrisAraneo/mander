import type { Enemy } from '../world/enemy/enemy';
import type { Player } from '../world/player/player';

export const isAlive = (body: Player | Enemy): boolean =>
  body.dyingFor === null;
