import {
  type Tile,
  TILE_BRICK,
  TILE_STONE,
  TILE_WOOD,
  TILE_CERAMIC,
  TILE_FIREBALL,
} from '@mander/model';
import { match } from 'ts-pattern';
import { drawNothing } from '../canvas/draw-nothing';
import type { CanvasStep } from '../types/canvas-step';
import type { MaterialStyle } from '../types/material-style';
import { createBrickStep } from './internal/create-brick-step';
import { createCeramicStep } from './internal/create-ceramic-step';
import { createFireballTileStep } from './internal/create-fireball-tile-step';
import { createStoneStep } from './internal/create-stone-step';
import { createWoodStep } from './internal/create-wood-step';

export const createMaterialStep = (
  tile: Tile,
  pixelX: number,
  pixelY: number,
  style: MaterialStyle,
): CanvasStep =>
  match(tile)
    .with(TILE_BRICK, () => createBrickStep(pixelX, pixelY, style))
    .with(TILE_STONE, () => createStoneStep(pixelX, pixelY, style))
    .with(TILE_WOOD, () => createWoodStep(pixelX, pixelY, style))
    .with(TILE_CERAMIC, () => createCeramicStep(pixelX, pixelY, style))
    .with(TILE_FIREBALL, () => createFireballTileStep(pixelX, pixelY, style))
    .otherwise(() => drawNothing);
