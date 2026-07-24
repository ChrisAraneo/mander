import {
  PLAYER_HEIGHT_TILES,
  PLAYER_WIDTH_TILES,
  TILE_SIZE,
} from '@mander/generator';

export const PLAYER_WIDTH = PLAYER_WIDTH_TILES * TILE_SIZE;
export const PLAYER_HEIGHT = PLAYER_HEIGHT_TILES * TILE_SIZE;

export const ENEMY_WIDTH = 22;
export const ENEMY_HEIGHT = 22;

export const PLAYER_HITBOX_INSET_X = 4;
export const PLAYER_HITBOX_INSET_TOP = 2;
export const PLAYER_HITBOX_INSET_BOTTOM = 0;
export const ENEMY_HITBOX_INSET = 3;
export const ENEMY_MOVE_SPEED = 78;
export const ENEMY_JUMP_VELOCITY = 430;

export const MAX_SPEED_BONUS_PERCENT = 15;

export const PLAYER_DEATH_SECONDS = 0.75;
export const PLAYER_DEATH_LAUNCH_VELOCITY = 340;
export const ENEMY_DEATH_SECONDS = 0.3;
