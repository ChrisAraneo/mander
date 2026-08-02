import {
  TILE_AIR,
  TILE_BRICK,
  TILE_CERAMIC,
  TILE_DIRT,
  TILE_ENEMY,
  TILE_SPIKE,
  TILE_SPIKE_CEILING,
  TILE_STONE,
  TILE_WOOD,
} from '@mander/model';

import { STRUCTURE_END, STRUCTURE_START } from './special-tiles';

export const __ = TILE_AIR;
export const DR = TILE_DIRT;
export const EN = TILE_ENEMY;
export const SP = TILE_SPIKE;
export const SC = TILE_SPIKE_CEILING;
export const BR = TILE_BRICK;
export const ST = TILE_STONE;
export const WD = TILE_WOOD;
export const CR = TILE_CERAMIC;
export const SS = STRUCTURE_START;
export const EE = STRUCTURE_END;

export const aliasOf = (cell: number): string =>
  new Map<number, string>([
    [__, '__'],
    [DR, 'DR'],
    [EN, 'EN'],
    [SP, 'SP'],
    [SC, 'SC'],
    [BR, 'BR'],
    [ST, 'ST'],
    [WD, 'WD'],
    [CR, 'CR'],
    [SS, 'SS'],
    [EE, 'EE'],
  ]).get(cell) ?? String(cell);
