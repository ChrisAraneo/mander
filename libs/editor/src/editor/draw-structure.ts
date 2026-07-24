import {
  AIR,
  BLOCK,
  ENEMY,
  PLAYER_CLEARANCE,
  PLAYER_HEIGHT_TILES,
  PLAYER_WIDTH_TILES,
  SECTOR_WIDTH,
  type Structure,
  STRUCTURE_HEIGHT,
  surfaceHasHeadroom,
} from '@mander/generator';
import { forEach, range } from 'lodash-es';
import { match } from 'ts-pattern';

import { CELL, COLORS } from './constants';
import { reachableFromEntry } from './reachable-from-entry';

export interface EditorView {
  pixelRatio: number;
  cssWidth: number;
  cssHeight: number;
}

type Surfaces = ReturnType<typeof reachableFromEntry>['surfaces'];

const COLUMNS = range(SECTOR_WIDTH);
const ROWS = range(STRUCTURE_HEIGHT);

const drawPits = (
  context: CanvasRenderingContext2D,
  grid: Structure,
  view: EditorView,
): void => {
  forEach(COLUMNS, (column) =>
    match(grid[STRUCTURE_HEIGHT - 1][column])
      .with(AIR, () => {
        context.fillStyle = COLORS.pit;
        context.fillRect(column * CELL, 0, CELL, view.cssHeight);
      })
      .otherwise(() => undefined),
  );
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
  match(row === 0 || grid[row - 1][column] === AIR)
    .with(true, () => {
      context.fillStyle = COLORS.cap;
      context.fillRect(pixelX + 1, pixelY + 1, CELL - 2, 4);
    })
    .otherwise(() => undefined);
};

const drawBlocks = (
  context: CanvasRenderingContext2D,
  grid: Structure,
): void => {
  forEach(ROWS, (row) =>
    forEach(COLUMNS, (column) =>
      match(grid[row][column])
        .with(BLOCK, () => drawBlockCell(context, grid, row, column))
        .otherwise(() => undefined),
    ),
  );
};

const drawEnemyEyes = (
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
): void => {
  context.fillStyle = '#FDF3EA';
  context.beginPath();
  context.arc(centerX - 4, centerY - 2, 2.6, 0, Math.PI * 2);
  context.arc(centerX + 4, centerY - 2, 2.6, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = '#1C1C28';
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
  match(isStranded)
    .with(true, () => {
      context.strokeStyle = COLORS.stranded;
      context.lineWidth = 2;
      context.strokeRect(pixelX + 2, pixelY + 2, CELL - 4, CELL - 4);
    })
    .otherwise(() => undefined);
};

const isEnemyStranded = (
  grid: Structure,
  row: number,
  column: number,
): boolean => row + 1 >= STRUCTURE_HEIGHT || grid[row + 1][column] !== BLOCK;

const drawEnemies = (
  context: CanvasRenderingContext2D,
  grid: Structure,
): void => {
  forEach(ROWS, (row) =>
    forEach(COLUMNS, (column) =>
      match(grid[row][column])
        .with(ENEMY, () =>
          drawEnemyMarker(
            context,
            column * CELL,
            row * CELL,
            isEnemyStranded(grid, row, column),
          ),
        )
        .otherwise(() => undefined),
    ),
  );
};

const drawGridLines = (
  context: CanvasRenderingContext2D,
  view: EditorView,
): void => {
  context.strokeStyle = COLORS.line;
  context.lineWidth = 1;
  context.beginPath();
  forEach(range(SECTOR_WIDTH + 1), (column) => {
    context.moveTo(column * CELL + 0.5, 0);
    context.lineTo(column * CELL + 0.5, view.cssHeight);
  });
  forEach(range(STRUCTURE_HEIGHT + 1), (row) => {
    context.moveTo(0, row * CELL + 0.5);
    context.lineTo(view.cssWidth, row * CELL + 0.5);
  });
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
    context.fillStyle = match(reached[surfaceIndex])
      .with(true, () => COLORS.reachable)
      .otherwise(() => COLORS.stranded);
    context.beginPath();
    context.arc(
      surface.col * CELL + CELL / 2,
      row * CELL + 7,
      3.5,
      0,
      Math.PI * 2,
    );
    context.fill();
  });
};

const drawCrampedHeadroom = (
  context: CanvasRenderingContext2D,
  grid: Structure,
  surfaces: Surfaces,
): void => {
  context.fillStyle = COLORS.cramped;
  forEach(surfaces, (surface) =>
    match(surfaceHasHeadroom(grid, surface))
      .with(true, () => undefined)
      .otherwise(() => {
        const row = STRUCTURE_HEIGHT - 1 - surface.height;
        context.fillRect(
          surface.col * CELL,
          (row - PLAYER_CLEARANCE) * CELL,
          CELL,
          PLAYER_CLEARANCE * CELL,
        );
      }),
  );
};

const drawPlayerGhost = (context: CanvasRenderingContext2D): void => {
  const width = PLAYER_WIDTH_TILES * CELL;
  const height = PLAYER_HEIGHT_TILES * CELL;
  const pixelX = (CELL - width) / 2;
  const pixelY = (STRUCTURE_HEIGHT - 1) * CELL - height;

  context.fillStyle = COLORS.player;
  context.fillRect(pixelX, pixelY, width, height);
  context.strokeStyle = COLORS.playerOutline;
  context.lineWidth = 1;
  context.strokeRect(pixelX + 0.5, pixelY + 0.5, width - 1, height - 1);
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
  drawCrampedHeadroom(context, grid, surfaces);
  drawBlocks(context, grid);
  drawEnemies(context, grid);
  drawGridLines(context, view);
  drawGroundLine(context, view);
  drawPlayerGhost(context);
  drawSurfaces(context, surfaces, reached);
};
