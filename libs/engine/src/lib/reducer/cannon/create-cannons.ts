import {
  type Cannon,
  findCannonTiles,
  type Level,
  TILE_SIZE,
} from '@mander/model';
import { map } from 'lodash-es';
import { pipe } from 'remeda';
import { CANNON_RESTING_ANGLE } from './consts';
import { getCannonReloadSeconds } from './internal/get-cannon-reload-seconds';
import { toCannonKind } from './internal/to-cannon-kind';

export const createCannons = (level: Level): Cannon[] =>
  map(findCannonTiles(level), ({ x, y, tile }) =>
    pipe(toCannonKind(tile), (kind): Cannon => ({
      kind,
      barrelAngle: CANNON_RESTING_ANGLE,
      roundIndex: 0,
      position: { x: x * TILE_SIZE, y: y * TILE_SIZE },
      timers: { reload: getCannonReloadSeconds(kind) },
      statuses: { isFacingRight: true },
    })),
  );
