import type { DyingPlayerDrop } from './types/dying-player-drop';
import type { DyingPlayerFall } from './types/dying-player-fall';

export const computeDyingPlayerDrop = ({
  player,
  death,
  deltaSeconds,
  velocityY,
}: DyingPlayerFall): DyingPlayerDrop => ({
  player,
  death,
  deltaSeconds,
  velocityY,
  positionY: player.position.y + player.velocity.y.current * deltaSeconds,
});
