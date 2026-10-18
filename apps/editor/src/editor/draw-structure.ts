import {
  createCannons,
  createEnemies,
  createFallingSpikes,
  createFireballs,
} from '@mander/engine';
import { type Layers, TILE_SIZE, chain } from '@mander/model';
import {
  drawCannon,
  drawEnemy,
  drawFallingSpike,
  drawFireball,
  drawTiles,
  type Palette,
} from '@mander/render';
import { STRUCTURE_END, STRUCTURE_START } from '@mander/structures';
import { forEach, includes, map, tap } from 'lodash-es';

import { drawMarker } from './draw-marker';
import { drawOrbit } from './draw-orbit';
import { createStructureTileMap } from './create-structure-tile-map';

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

const findMarkerCells = (grid: number[][]): MarkerCell[] =>
  chain(grid)
    .flatMap((cells, row) =>
      map(cells, (cell, column): MarkerCell => ({ cell, row, column })),
    )
    .filter(({ cell }) => includes(MARKERS, cell))
    .value();

export const drawStructure = (
  context: CanvasRenderingContext2D,
  sketch: Layers,
): void =>
  void chain(createStructureTileMap(sketch))
    .thru((level) => ({
      level,
      width: level.width * TILE_SIZE,
      height: level.height * TILE_SIZE,
    }))
    .thru((scene) =>
      tap(scene, () =>
        context.clearRect(0, 0, scene.width, scene.height),
      ),
    )
    .thru((scene) =>
      tap(scene, () =>
        drawTiles(context, scene.level, NO_PALETTE, 0, 0, {
          width: scene.width,
          height: scene.height,
          scale: 1,
        }),
      ),
    )
    .thru((scene) =>
      tap(scene, () =>
        forEach(createCannons(scene.level), (cannon) =>
          drawCannon(context, cannon),
        ),
      ),
    )
    .thru((scene) =>
      tap(scene, () =>
        forEach(createEnemies(scene.level), (enemy) =>
          drawEnemy(context, enemy, 0),
        ),
      ),
    )
    .thru((scene) =>
      tap(scene, () =>
        forEach(createFallingSpikes(scene.level), (spike) =>
          drawFallingSpike(context, spike),
        ),
      ),
    )
    .thru((scene) =>
      tap(scene, () =>
        forEach(createFireballs(scene.level), (fireball) =>
          chain(fireball)
            .thru((orbiting) =>
              tap(orbiting, () => drawOrbit(context, orbiting)),
            )
            .thru((orbiting) => drawFireball(context, orbiting, 0))
            .value(),
        ),
      ),
    )
    .thru(() =>
      forEach(findMarkerCells(sketch.tiles), ({ cell, row, column }) =>
        drawMarker(context, cell, row, column),
      ),
    )
    .value();
