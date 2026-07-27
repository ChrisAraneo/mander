import type { ReachMap } from '@mander/engine';
import { type Structure, structureSurfaces } from '@mander/generator';

import type { EditorView } from '../types/editor-view';
import { drawPits } from './draw-pits';
import { drawBlocks } from './draw-blocks';
import { drawEnemies } from './draw-enemies';
import { drawSpikes } from './draw-spikes';
import { drawGridLines } from './draw-grid-lines';
import { drawGroundLine } from './draw-ground-line';
import { drawCrampedHeadroom } from './draw-cramped-headroom';
import { drawPlayerGhost } from './draw-player-ghost';
import { drawSurfaces } from './draw-surfaces';

export const drawStructure = (
  context: CanvasRenderingContext2D,
  grid: Structure,
  view: EditorView,
  reach: ReachMap,
): void => {
  const surfaces = structureSurfaces(grid);
  context.setTransform(view.pixelRatio, 0, 0, view.pixelRatio, 0, 0);
  context.clearRect(0, 0, view.cssWidth, view.cssHeight);
  drawPits(context, grid, view);
  drawCrampedHeadroom(context, grid, surfaces);
  drawBlocks(context, grid);
  drawEnemies(context, grid);
  drawSpikes(context, grid);
  drawGridLines(context, view);
  drawGroundLine(context, view);
  drawPlayerGhost(context);
  drawSurfaces(context, surfaces, reach);
};
