import type { Enemy, Player } from '@mander/model';
import { isNull } from 'lodash-es';

export const isAlive = (body: Player | Enemy): boolean =>
  isNull(body.timers.death);
