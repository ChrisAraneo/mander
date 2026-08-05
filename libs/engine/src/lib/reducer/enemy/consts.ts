import { TILE_SIZE } from '@mander/model';

export const ENEMY_WIDTH = 22;
export const ENEMY_HEIGHT = 22;

export const ENEMY_HITBOX_INSET = 3;

export const STOMP_GRACE_X = 4;
export const STOMP_GRACE_Y = ENEMY_HEIGHT / 2;

export const ENEMY_MOVE_SPEED = 78;
export const ENEMY_JUMP_VELOCITY = 430;
export const HORNED_ENEMY_JUMP_VELOCITY = ENEMY_JUMP_VELOCITY * 0.7;

export const ENEMY_DEATH_SECONDS = 0.3;

export const HORNED_ENEMY_CHANCE = 0.5;

export const FLYING_ENEMY_MOVE_SPEED = ENEMY_MOVE_SPEED * 0.75;
export const FLYING_ENEMY_RANGE = TILE_SIZE;
