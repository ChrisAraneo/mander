import {
  isSolidTile,
  TILE_AIR,
  TILE_BEARTRAP,
  TILE_ENEMY,
  TILE_SPIKE,
  TILE_SPIKE_CEILING,
  TILE_SPIKE_FALLING,
} from '@mander/model';
import { STRUCTURE_START, STRUCTURE_END } from '@mander/structures';
import { includes } from 'lodash-es';

const KNOWN_TILES = [
  TILE_AIR,
  TILE_BEARTRAP,
  TILE_ENEMY,
  TILE_SPIKE,
  TILE_SPIKE_CEILING,
  TILE_SPIKE_FALLING,
  STRUCTURE_START,
  STRUCTURE_END,
];

export const isKnown = (cell: number): boolean =>
  includes(KNOWN_TILES, cell) || isSolidTile(cell);
