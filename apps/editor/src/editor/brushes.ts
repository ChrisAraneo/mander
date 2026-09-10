import {
  TILE_AIR,
  TILE_BEARTRAP,
  TILE_BRICK,
  TILE_CANNON,
  TILE_CERAMIC,
  TILE_DIRT,
  TILE_ENEMY,
  TILE_FIREBALL,
  TILE_SPIKE,
  TILE_SPIKE_CEILING,
  TILE_SPIKE_FALLING,
  TILE_STONE,
  TILE_WOOD,
} from '@mander/model';
import { STRUCTURE_START, STRUCTURE_END } from '@mander/structures';

import type { Brush, BrushLayer } from './brush';

const FRONT: BrushLayer = 'front';

const BACK: BrushLayer = 'back';

export const EMPTY = 'Empty';
export const BLOCKS = 'Blocks';
export const HAZARDS = 'Hazards';
export const BACKGROUND = 'Background';
export const MARKERS = 'Markers';

// the background brushes carry the same blocks as the front ones: it is the
// layer they paint into, not the block, that puts them behind the level
export const BRUSHES: Brush[] = [
  {
    value: TILE_AIR,
    label: 'Air',
    shortcut: '0',
    group: EMPTY,
    layer: FRONT,
  },
  {
    value: TILE_DIRT,
    label: 'Dirt',
    shortcut: '1',
    group: BLOCKS,
    layer: FRONT,
  },
  {
    value: TILE_BRICK,
    label: 'Brick',
    shortcut: '5',
    group: BLOCKS,
    layer: FRONT,
  },
  {
    value: TILE_STONE,
    label: 'Stone',
    shortcut: '6',
    group: BLOCKS,
    layer: FRONT,
  },
  {
    value: TILE_WOOD,
    label: 'Wood',
    shortcut: '7',
    group: BLOCKS,
    layer: FRONT,
  },
  {
    value: TILE_CERAMIC,
    label: 'Ceramic',
    shortcut: '8',
    group: BLOCKS,
    layer: FRONT,
  },
  {
    value: TILE_ENEMY,
    label: 'Enemy',
    shortcut: '2',
    group: HAZARDS,
    layer: FRONT,
  },
  {
    value: TILE_SPIKE,
    label: 'Spike',
    shortcut: '3',
    group: HAZARDS,
    layer: FRONT,
  },
  {
    value: TILE_SPIKE_CEILING,
    label: 'Ceiling spike',
    shortcut: '4',
    group: HAZARDS,
    layer: FRONT,
  },
  {
    value: TILE_SPIKE_FALLING,
    label: 'Falling spike',
    shortcut: 'r',
    group: HAZARDS,
    layer: FRONT,
  },
  {
    value: TILE_BEARTRAP,
    label: 'Beartrap',
    shortcut: 'b',
    group: HAZARDS,
    layer: FRONT,
  },
  {
    value: TILE_CANNON,
    label: 'Cannon',
    shortcut: '9',
    group: HAZARDS,
    layer: FRONT,
  },
  {
    value: TILE_FIREBALL,
    label: 'Fireball',
    shortcut: 'f',
    group: HAZARDS,
    layer: FRONT,
  },
  {
    value: TILE_DIRT,
    label: 'Dirt',
    shortcut: 'q',
    group: BACKGROUND,
    layer: BACK,
  },
  {
    value: TILE_BRICK,
    label: 'Brick',
    shortcut: 't',
    group: BACKGROUND,
    layer: BACK,
  },
  {
    value: TILE_STONE,
    label: 'Stone',
    shortcut: 'y',
    group: BACKGROUND,
    layer: BACK,
  },
  {
    value: TILE_WOOD,
    label: 'Wood',
    shortcut: 'u',
    group: BACKGROUND,
    layer: BACK,
  },
  {
    value: TILE_CERAMIC,
    label: 'Ceramic',
    shortcut: 'i',
    group: BACKGROUND,
    layer: BACK,
  },
  {
    value: STRUCTURE_START,
    label: 'Start',
    shortcut: 's',
    group: MARKERS,
    layer: FRONT,
  },
  {
    value: STRUCTURE_END,
    label: 'End',
    shortcut: 'e',
    group: MARKERS,
    layer: FRONT,
  },
];

// the block the editor opens with
export const DEFAULT_BRUSH: Brush = BRUSHES[1];
