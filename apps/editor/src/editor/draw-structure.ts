import { createEnemies } from '@mander/engine';
import { TILE_SIZE } from '@mander/model';
import { drawEnemy, drawTiles, type Palette } from '@mander/render';
import { STRUCTURE_END, STRUCTURE_START } from '@mander/structures';
import { forEach } from 'lodash-es';

import { drawMarker } from './draw-marker';
import { structureTileMap } from './structure-tile-map';

const NO_PALETTE: Palette = {
  sky: ['', '', ''],
  hills: ['', ''],
  block: '',
  blockCap: '',
  blockCapHighlight: '',
};

export const drawStructure = (
  context: CanvasRenderingContext2D,
  grid: number[][],
): void => {
  const level = structureTileMap(grid);
  const width = level.width * TILE_SIZE;
  const height = level.height * TILE_SIZE;

  context.clearRect(0, 0, width, height);
  drawTiles(context, level, NO_PALETTE, 0, 0, { width, height, scale: 1 });
  forEach(createEnemies(level), (enemy) => drawEnemy(context, enemy, 0));
  forEach(grid, (cells, row) =>
    forEach(cells, (cell, column) => {
      if (cell === STRUCTURE_START || cell === STRUCTURE_END)
        drawMarker(context, cell, row, column);
    }),
  );
};
