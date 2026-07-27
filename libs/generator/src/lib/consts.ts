import { PLAYER_HEIGHT_TILES } from '@mander/engine';

export const LEVEL_HEIGHT = 80;
export const LEVELS_PER_SEED = 8;

export const BASE_GROUND = 6;

export const INTRO_WIDTH = 20;
export const OUTRO_WIDTH = 20;
export const SECTOR_WIDTH = 20;
export const SECTOR_COUNT = 4;

export const LEVEL_WIDTH =
  INTRO_WIDTH + SECTOR_COUNT * SECTOR_WIDTH + OUTRO_WIDTH;

export const STRUCTURE_HEIGHT = 8;

export const PLAYER_CLEARANCE = Math.ceil(PLAYER_HEIGHT_TILES);
export const SPIKE_MIN_GAP = 2;
export const SPIKE_CLEARANCE = 2;
export const SPIKE_MIN_ENEMY_DISTANCE = 3;
export const SPIKE_MAX_RUN = 2;
export const DOUBLE_SPIKE_CHANCE = 0.5;
