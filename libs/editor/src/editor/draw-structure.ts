import {
  AIR,
  BLOCK,
  ENEMY,
  SECTOR_WIDTH,
  type Structure,
  STRUCTURE_HEIGHT,
} from '@mander/generator';
import { forEach } from 'lodash-es';

import { CELL, COLORS } from './constants';
import { reachableFromEntry } from './reachable-from-entry';

export interface EditorView {
  pixelRatio: number;
  cssWidth: number;
  cssHeight: number;
}

type Surfaces = ReturnType<typeof reachableFromEntry>['surfaces'];

const drawPits = (
  context: CanvasRenderingContext2D,
  grid: Structure,
  view: EditorView,
): void => {
  for (let column = 0; column < SECTOR_WIDTH; column++) {
    if (grid[STRUCTURE_HEIGHT - 1][column] === AIR) {
      context.fillStyle = COLORS.pit;
      context.fillRect(column * CELL, 0, CELL, view.cssHeight);
    }
  }
};

const drawBlockCell = (
  context: CanvasRenderingContext2D,
  grid: Structure,
  row: number,
  column: number,
): void => {
  const pixelX = column * CELL;
  const pixelY = row * CELL;
  context.fillStyle = COLORS.block;
  context.fillRect(pixelX + 1, pixelY + 1, CELL - 2, CELL - 2);
  if (row === 0 || grid[row - 1][column] === AIR) {
    context.fillStyle = COLORS.cap;
    context.fillRect(pixelX + 1, pixelY + 1, CELL - 2, 4);
  }
};

const drawBlocks = (
  context: CanvasRenderingContext2D,
  grid: Structure,
): void => {
  for (let row = 0; row < STRUCTURE_HEIGHT; row++) {
    for (let column = 0; column < SECTOR_WIDTH; column++) {
      if (grid[row][column] === BLOCK) drawBlockCell(context, grid, row, column);
    }
  }
};

const drawEnemyEyes = (
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
): void => {
  context.fillStyle = '#fdf3ea';
  context.beginPath();
  context.arc(centerX - 4, centerY - 2, 2.6, 0, Math.PI * 2);
  context.arc(centerX + 4, centerY - 2, 2.6, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = '#1c1c28';
  context.beginPath();
  context.arc(centerX - 4, centerY - 2, 1.1, 0, Math.PI * 2);
  context.arc(centerX + 4, centerY - 2, 1.1, 0, Math.PI * 2);
  context.fill();
};

const drawEnemyMarker = (
  context: CanvasRenderingContext2D,
  pixelX: number,
  pixelY: number,
  isStranded: boolean,
): void => {
  context.fillStyle = COLORS.enemy;
  context.beginPath();
  context.roundRect(pixelX + 6, pixelY + 6, CELL - 12, CELL - 12, 5);
  context.fill();
  drawEnemyEyes(context, pixelX + CELL / 2, pixelY + CELL / 2);
  if (isStranded) {
    context.strokeStyle = COLORS.stranded;
    context.lineWidth = 2;
    context.strokeRect(pixelX + 2, pixelY + 2, CELL - 4, CELL - 4);
  }
};

const drawEnemies = (
  context: CanvasRenderingContext2D,
  grid: Structure,
): void => {
  for (let row = 0; row < STRUCTURE_HEIGHT; row++) {
    for (let column = 0; column < SECTOR_WIDTH; column++) {
      if (grid[row][column] === ENEMY) {
        const isStranded =
          row + 1 >= STRUCTURE_HEIGHT || grid[row + 1][column] !== BLOCK;
        drawEnemyMarker(context, column * CELL, row * CELL, isStranded);
      }
    }
  }
};

const drawGridLines = (
  context: CanvasRenderingContext2D,
  view: EditorView,
): void => {
  context.strokeStyle = COLORS.line;
  context.lineWidth = 1;
  context.beginPath();
  for (let column = 0; column <= SECTOR_WIDTH; column++) {
    context.moveTo(column * CELL + 0.5, 0);
    context.lineTo(column * CELL + 0.5, view.cssHeight);
  }
  for (let row = 0; row <= STRUCTURE_HEIGHT; row++) {
    context.moveTo(0, row * CELL + 0.5);
    context.lineTo(view.cssWidth, row * CELL + 0.5);
  }
  context.stroke();
};

const drawGroundLine = (
  context: CanvasRenderingContext2D,
  view: EditorView,
): void => {
  context.strokeStyle = COLORS.ground;
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(0, (STRUCTURE_HEIGHT - 1) * CELL);
  context.lineTo(view.cssWidth, (STRUCTURE_HEIGHT - 1) * CELL);
  context.stroke();
};

const drawSurfaces = (
  context: CanvasRenderingContext2D,
  surfaces: Surfaces,
  reached: boolean[],
): void => {
  forEach(surfaces, (surface, surfaceIndex) => {
    const row = STRUCTURE_HEIGHT - 1 - surface.height;
    context.fillStyle = reached[surfaceIndex]
      ? COLORS.reachable
      : COLORS.stranded;
    context.beginPath();
    context.arc(surface.col * CELL + CELL / 2, row * CELL + 7, 3.5, 0, Math.PI * 2);
    context.fill();
  });
};

export const drawStructure = (
  context: CanvasRenderingContext2D,
  grid: Structure,
  view: EditorView,
): void => {
  const { surfaces, reached } = reachableFromEntry(grid);
  context.setTransform(view.pixelRatio, 0, 0, view.pixelRatio, 0, 0);
  context.clearRect(0, 0, view.cssWidth, view.cssHeight);
  drawPits(context, grid, view);
  drawBlocks(context, grid);
  drawEnemies(context, grid);
  drawGridLines(context, view);
  drawGroundLine(context, view);
  drawSurfaces(context, surfaces, reached);
};
