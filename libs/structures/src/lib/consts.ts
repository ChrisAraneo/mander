import {
  TILE_AIR,
  TILE_CANNON,
  TILE_DIRT,
  TILE_ENEMY,
  TILE_FIREBALL,
  TILE_SPIKE,
  TILE_SPIKE_CEILING,
  TILE_SPIKE_FALLING,
  TILE_BRICK,
  TILE_WOOD,
  TILE_CERAMIC,
} from '@mander/model';
import { TILE_STONE } from '../../../model/src/lib/blocks/stone';
import { STRUCTURE_END, STRUCTURE_START } from './special-tiles';

export const STRUCTURE_WIDTH = 20;
export const STRUCTURE_HEIGHT = 20;

export const __ = TILE_AIR;
export const DR = TILE_DIRT;
export const EN = TILE_ENEMY;
export const SP = TILE_SPIKE;
export const SC = TILE_SPIKE_CEILING;
export const SF = TILE_SPIKE_FALLING;
export const BR = TILE_BRICK;
export const ST = TILE_STONE;
export const WD = TILE_WOOD;
export const CR = TILE_CERAMIC;
export const CN = TILE_CANNON;
export const FB = TILE_FIREBALL;
export const SS = STRUCTURE_START;
export const EE = STRUCTURE_END;
