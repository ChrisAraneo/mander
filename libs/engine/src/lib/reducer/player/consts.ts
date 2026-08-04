import { TILE_SIZE } from '@mander/model';

export const PLAYER_WIDTH_TILES = 0.6875;
export const PLAYER_HEIGHT_TILES = 1.5;

export const PLAYER_WIDTH = PLAYER_WIDTH_TILES * TILE_SIZE;
export const PLAYER_HEIGHT = PLAYER_HEIGHT_TILES * TILE_SIZE;

export const PLAYER_HITBOX_INSET_X = 4;
export const PLAYER_HITBOX_INSET_TOP = 2;
export const PLAYER_HITBOX_INSET_BOTTOM = 0;

export const PLAYER_DEATH_SECONDS = 0.75;
export const PLAYER_DEATH_LAUNCH_VELOCITY = 340;
export const STOMP_BOUNCE_VELOCITY = 320;

export const BASE_HEARTS = 5;
export const INVINCIBLE_SECONDS = 3;
