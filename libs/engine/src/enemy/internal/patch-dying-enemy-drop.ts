import type { Enemy } from '@mander/model';
import { match } from 'ts-pattern';
import type { DyingEnemyDrop } from './types/dying-enemy-drop';

const STOPPED_SPEED = 0;

export const patchDyingEnemyDrop = ({
  enemy,
  velocityY,
  vertical,
}: DyingEnemyDrop): Enemy => ({
  ...enemy,
  position: { ...enemy.position, y: vertical.position },
  velocity: {
    ...enemy.velocity,
    y: {
      ...enemy.velocity.y,
      current: match(vertical.isBlocked)
        .with(true, () => STOPPED_SPEED)
        .otherwise(() => velocityY),
    },
  },
});
