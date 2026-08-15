import { type Player } from '@mander/model';
import { PLAYER_MAX_JUMP_VELOCITY, PLAYER_MAX_MOVE_VELOCITY } from './consts';

export const createBasePlayerVelocity = (): Player['velocity'] => ({
  x: { current: 0, max: PLAYER_MAX_MOVE_VELOCITY },
  y: { current: 0, max: PLAYER_MAX_JUMP_VELOCITY },
});
