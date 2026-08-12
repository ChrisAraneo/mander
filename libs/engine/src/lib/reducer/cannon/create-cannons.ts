import {
  type Cannon,
  findCannonTiles,
  type Level,
  TILE_SIZE,
} from '@mander/model';
import { map } from 'lodash-es';

import { CANNON_RELOAD_SECONDS } from './consts';

export const createCannons = (level: Level): Cannon[] =>
  map(findCannonTiles(level), (tile): Cannon => ({
    position: { x: tile.x * TILE_SIZE, y: tile.y * TILE_SIZE },
    timers: { reload: CANNON_RELOAD_SECONDS },
    statuses: { isFacingRight: true },
  }));
