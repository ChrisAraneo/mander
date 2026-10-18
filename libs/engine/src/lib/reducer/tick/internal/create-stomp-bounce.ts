import type { Enemy, Player } from '@mander/model';
import { computeBounceVelocity } from './compute-bounce-velocity';
import { patchStruckEnemies } from './patch-struck-enemies';
import type { TickBounce } from './types/tick-bounce';

export const createStompBounce = (
  player: Player,
  enemies: Enemy[],
  victims: Enemy[],
  isJumpHeld: boolean,
): TickBounce => ({
  player: {
    ...player,
    velocity: {
      ...player.velocity,
      y: {
        ...player.velocity.y,
        current: computeBounceVelocity(isJumpHeld, player),
      },
    },
  },
  enemies: patchStruckEnemies(enemies, victims),
});
