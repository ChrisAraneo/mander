import { type Level, TILE_SIZE } from '@mander/model';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import type { CanvasStep } from '../../types/canvas-step';
import type { MaterialStyle } from '../../types/material-style';
import { createTileEdgesStep } from '../create-tile-edges-step';
import { isSolidAt } from '../is-solid-at';
import { createTileBodyStep } from './create-tile-body-step';

export const createSolidTileStep = (
  level: Level,
  column: number,
  row: number,
  style: MaterialStyle,
): CanvasStep =>
  createSequenceStep([
    createTileBodyStep(
      level.tiles[row][column],
      column * TILE_SIZE,
      row * TILE_SIZE,
      style,
      !isSolidAt(level, column, row - 1),
    ),
    createTileEdgesStep(level, column, row),
  ]);
