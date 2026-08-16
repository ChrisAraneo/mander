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
import { chain, withEffect } from '@mander/utils';
import { forEach, includes, map } from 'lodash-es';

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

const MARKERS = [STRUCTURE_START, STRUCTURE_END];

interface MarkerCell {
  cell: number;
  row: number;
  column: number;
}

const markerCells = (grid: number[][]): MarkerCell[] =>
  chain(grid)
    .flatMap((cells, row) =>
      map(cells, (cell, column): MarkerCell => ({ cell, row, column })),
    )
    .filter(({ cell }) => includes(MARKERS, cell))
    .value();

export const drawStructure = (
  context: CanvasRenderingContext2D,
  grid: number[][],
): void =>
  void chain(structureTileMap(grid))
    .thru((level) => ({
      level,
      width: level.width * TILE_SIZE,
      height: level.height * TILE_SIZE,
    }))
    .thru((scene) =>
      withEffect(scene, () =>
        context.clearRect(0, 0, scene.width, scene.height),
      ),
    )
    .thru((scene) =>
      withEffect(scene, () =>
        drawTiles(context, scene.level, NO_PALETTE, 0, 0, {
          width: scene.width,
          height: scene.height,
          scale: 1,
        }),
      ),
    )
    .thru((scene) =>
      withEffect(scene, () =>
        forEach(createCannons(scene.level), (cannon) =>
          drawCannon(context, cannon),
        ),
      ),
    )
    .thru((scene) =>
      withEffect(scene, () =>
        forEach(createEnemies(scene.level), (enemy) =>
          drawEnemy(context, enemy, 0),
        ),
      ),
    )
    .thru((scene) =>
      withEffect(scene, () =>
        forEach(createFireballs(scene.level), (fireball) =>
          chain(fireball)
            .thru((orbiting) =>
              withEffect(orbiting, () => drawOrbit(context, orbiting)),
            )
            .thru((orbiting) => drawFireball(context, orbiting, 0))
            .value(),
        ),
      ),
    )
    .thru(() =>
      forEach(markerCells(grid), ({ cell, row, column }) =>
        drawMarker(context, cell, row, column),
      ),
    )
    .value();
