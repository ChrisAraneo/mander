import {
  type Tile,
  TILE_BRICK,
  TILE_CERAMIC,
  TILE_STONE,
  TILE_WOOD,
} from '@mander/engine';
import { match } from 'ts-pattern';

import type { MaterialStyle } from './material-style';

const JOINT = 'RGBA(0, 0, 0, 0.26)';
const HIGHLIGHT = 'RGBA(255, 255, 255, 0.16)';

export const DIRT_STYLE: MaterialStyle = {
  base: '#6F5A43',
  cap: '#7EA653',
  capHighlight: '#93C268',
  joint: JOINT,
  highlight: HIGHLIGHT,
};

export const BRICK_STYLE: MaterialStyle = {
  base: '#9C4F3F',
  cap: '#B25C49',
  capHighlight: '#C86E59',
  joint: JOINT,
  highlight: HIGHLIGHT,
};

export const STONE_STYLE: MaterialStyle = {
  base: '#6D7480',
  cap: '#838B98',
  capHighlight: '#9AA2AE',
  joint: JOINT,
  highlight: HIGHLIGHT,
};

export const WOOD_STYLE: MaterialStyle = {
  base: '#96694F',
  cap: '#A87A5E',
  capHighlight: '#BD8D6F',
  joint: 'RGBA(52, 38, 30, 0.85)',
  highlight: 'RGBA(220, 174, 142, 0.18)',
};

export const CERAMIC_STYLE: MaterialStyle = {
  base: '#AE42B8',
  cap: '#BB5AC4',
  capHighlight: '#C674CD',
  joint: JOINT,
  highlight: HIGHLIGHT,
};

export const materialStyle = (tile: Tile): MaterialStyle =>
  match(tile)
    .with(TILE_BRICK, () => BRICK_STYLE)
    .with(TILE_STONE, () => STONE_STYLE)
    .with(TILE_WOOD, () => WOOD_STYLE)
    .with(TILE_CERAMIC, () => CERAMIC_STYLE)
    .otherwise(() => DIRT_STYLE);
