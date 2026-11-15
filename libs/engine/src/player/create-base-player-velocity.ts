import { PLAYER_MAX_JUMP_VELOCITY, PLAYER_MAX_MOVE_VELOCITY } from './consts';
import type { PlayerVelocity } from './types/player-velocity';

export const createBasePlayerVelocity = (): PlayerVelocity => ({
  x: { current: 0, max: PLAYER_MAX_MOVE_VELOCITY },
  y: { current: 0, max: PLAYER_MAX_JUMP_VELOCITY },
});
