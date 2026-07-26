import {
  AIR,
  BLOCK,
  ENEMY,
  PLAYER_CLEARANCE,
  PLAYER_HEIGHT_TILES,
  PLAYER_WIDTH_TILES,
  SECTOR_WIDTH,
  SPIKE,
  SPIKE_CEILING,
  type Structure,
  STRUCTURE_HEIGHT,
  surfaceHasHeadroom,
} from '@mander/generator';
import { forEach, range } from 'lodash-es';
import { match } from 'ts-pattern';

import { CELL, COLORS } from '../../constants';
import type { EditorView } from '../editor-view';
import { reachableFromEntry } from '../reachable-from-entry';
import { drawPits } from './draw-pits';
import { drawBlocks } from './draw-blocks';

type Surfaces = ReturnType<typeof reachableFromEntry>['surfaces'];

const COLUMNS = range(SECTOR_WIDTH);
const ROWS = range(STRUCTURE_HEIGHT);

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

const PRONGS = 3;

const drawSpikeCell = (
  context: CanvasRenderingContext2D,
  pixelX: number,
  pixelY: number,
  isPointingDown: boolean,
): void => {
  const prongWidth = CELL / PRONGS;
  const prongHeight = CELL * 0.72;
  const base = match(isPointingDown)
    .with(true, () => pixelY)
    .otherwise(() => pixelY + CELL);
  const tip = match(isPointingDown)
    .with(true, () => pixelY + prongHeight)
    .otherwise(() => pixelY + CELL - prongHeight);
  context.fillStyle = COLORS.spike;
  context.strokeStyle = COLORS.spikeOutline;
  context.lineWidth = 1;
  forEach(range(PRONGS), (prong) => {
    const left = pixelX + prong * prongWidth;
    context.beginPath();
    context.moveTo(left, base);
    context.lineTo(left + prongWidth / 2, tip);
    context.lineTo(left + prongWidth, base);
    context.closePath();
    context.fill();
    context.stroke();
  });
};

const drawSpikes = (
  context: CanvasRenderingContext2D,
  grid: Structure,
): void => {
  forEach(ROWS, (row) =>
    forEach(COLUMNS, (column) =>
      match(grid[row][column])
        .with(SPIKE, () =>
          drawSpikeCell(context, column * CELL, row * CELL, false),
        )
        .with(SPIKE_CEILING, () =>
          drawSpikeCell(context, column * CELL, row * CELL, true),
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
  drawSpikes(context, grid);
  drawGridLines(context, view);
  drawGroundLine(context, view);
  drawPlayerGhost(context);
  drawSurfaces(context, surfaces, reached);
};
