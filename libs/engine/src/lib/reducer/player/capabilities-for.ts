import { GRAVITY, MAX_JUMP_TILES, type Player, TILE_SIZE } from '@mander/model';

const BASE_MOVE_SPEED = 210;

const BASE_JUMP_VELOCITY = Math.sqrt(2 * GRAVITY * MAX_JUMP_TILES * TILE_SIZE);

export const capabilitiesFor = (): Player['velocity'] => ({
  x: { current: 0, max: BASE_MOVE_SPEED },
  y: { current: 0, max: BASE_JUMP_VELOCITY },
});
