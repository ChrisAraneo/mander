import type { Player } from '@mander/model';
import type { DyingPlayerDrop } from './types/dying-player-drop';

export const patchDyingPlayerDrop = ({
  player,
  death,
  deltaSeconds,
  velocityY,
  positionY,
}: DyingPlayerDrop): Player => ({
  ...player,
  position: { ...player.position, y: positionY },
  velocity: {
    ...player.velocity,
    y: { ...player.velocity.y, current: velocityY },
  },
  timers: { ...player.timers, death: death + deltaSeconds },
});
