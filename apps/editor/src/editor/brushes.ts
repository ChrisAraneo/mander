import {
  AIR,
  BLOCK,
  BRICK,
  CERAMIC,
  ENEMY,
  SPIKE,
  SPIKE_CEILING,
  STONE,
  WOOD,
} from '@mander/generator';

import type { Brush } from './brush';

/** Shortcut keys mirror the cell value, so the keyboard matches the output. */
export const BRUSHES: Brush[] = [
  { value: AIR, label: 'Air', shortcut: '0', group: 'Empty' },
  { value: BLOCK, label: 'Dirt', shortcut: '1', group: 'Blocks' },
  { value: BRICK, label: 'Brick', shortcut: '5', group: 'Blocks' },
  { value: STONE, label: 'Stone', shortcut: '6', group: 'Blocks' },
  { value: WOOD, label: 'Wood', shortcut: '7', group: 'Blocks' },
  { value: CERAMIC, label: 'Ceramic', shortcut: '8', group: 'Blocks' },
  { value: ENEMY, label: 'Enemy', shortcut: '2', group: 'Hazards' },
  { value: SPIKE, label: 'Spike', shortcut: '3', group: 'Hazards' },
  {
    value: SPIKE_CEILING,
    label: 'Ceiling spike',
    shortcut: '4',
    group: 'Hazards',
  },
];
