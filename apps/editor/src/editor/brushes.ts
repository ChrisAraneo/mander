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
import { STRUCTURE_START, STRUCTURE_END } from '@mander/structures';

import type { Brush } from './brush';

export const BRUSHES: Brush[] = [
  { value: TILE_AIR, label: 'Air', shortcut: '0', group: 'Empty' },
  { value: TILE_DIRT, label: 'Dirt', shortcut: '1', group: 'Blocks' },
  { value: TILE_BRICK, label: 'Brick', shortcut: '5', group: 'Blocks' },
  { value: TILE_STONE, label: 'Stone', shortcut: '6', group: 'Blocks' },
  { value: TILE_WOOD, label: 'Wood', shortcut: '7', group: 'Blocks' },
  { value: TILE_CERAMIC, label: 'Ceramic', shortcut: '8', group: 'Blocks' },
  { value: TILE_ENEMY, label: 'Enemy', shortcut: '2', group: 'Hazards' },
  { value: TILE_SPIKE, label: 'Spike', shortcut: '3', group: 'Hazards' },
  {
    value: TILE_SPIKE_CEILING,
    label: 'Ceiling spike',
    shortcut: '4',
    group: 'Hazards',
  },
  { value: STRUCTURE_START, label: 'Start', shortcut: 's', group: 'Markers' },
  { value: STRUCTURE_END, label: 'End', shortcut: 'e', group: 'Markers' },
];
