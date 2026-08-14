import { createCannons, createEnemies, createFireballs } from '@mander/engine';
import { TILE_SIZE } from '@mander/model';
import {
  drawCannon,
  drawEnemy,
  drawFireball,
  drawTiles,
  type Palette,
} from '@mander/render';
import { STRUCTURE_END, STRUCTURE_START } from '@mander/structures';
import { forEach } from 'lodash-es';

import { drawMarker } from './draw-marker';
import { drawOrbit } from './draw-orbit';
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
  forEach(createCannons(level), (cannon) => drawCannon(context, cannon));
  forEach(createEnemies(level), (enemy) => drawEnemy(context, enemy, 0));
  forEach(createFireballs(level), (fireball) => {
    drawOrbit(context, fireball);
    drawFireball(context, fireball, 0);
  });
  forEach(grid, (cells, row) =>
    forEach(cells, (cell, column) => {
      if (cell === STRUCTURE_START || cell === STRUCTURE_END)
        drawMarker(context, cell, row, column);
    }),
  );
};
