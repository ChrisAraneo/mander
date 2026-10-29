import { type Enemy, type Point } from '@mander/model';
import { BEARTRAP_JUMP_VELOCITY } from '../consts';
import { getEnemyReloadSeconds } from './get-enemy-reload-seconds';

export const createBeartrap = (point: Point): Enemy => ({
  kind: 'BEARTRAP',
  position: { ...point },
  velocity: {
    x: { current: 0, max: 0 },
    y: { current: 0, max: BEARTRAP_JUMP_VELOCITY },
  },
  timers: { death: null, reload: getEnemyReloadSeconds('BEARTRAP') },
  spawn: { ...point },
  statuses: { isFacingRight: true, isGrounded: false },
});
