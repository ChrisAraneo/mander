import { type Enemy, type EnemyKind, type Point } from '@mander/model';
import { getEnemyMaxVelocityY } from './get-enemy-max-velocity-y';
import { getEnemyMoveSpeed } from './get-enemy-move-speed';
import { getEnemyReloadSeconds } from './get-enemy-reload-seconds';

export const createPatrol = (point: Point, kind: EnemyKind): Enemy => ({
  kind,
  position: { ...point },
  velocity: {
    x: { current: 0, max: getEnemyMoveSpeed(kind) },
    y: { current: 0, max: getEnemyMaxVelocityY(kind) },
  },
  timers: { death: null, reload: getEnemyReloadSeconds(kind) },
  spawn: { ...point },
  statuses: { isFacingRight: true, isGrounded: false },
});
