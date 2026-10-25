import {
  createCannons,
  createEnemies,
  createFallingSpikes,
  createFireballs,
} from '@mander/engine';
import { type Layers, TILE_SIZE } from '@mander/model';
import {
  drawCannon,
  drawEnemy,
  drawFallingSpike,
  drawFireball,
  drawTiles,
  type Palette,
} from '@mander/render';
import { STRUCTURE_END, STRUCTURE_START } from '@mander/structures';
import { filter, flatMap, includes, map, tap } from 'lodash-es';
import { pipe } from 'remeda';
import { createStructureTileMap } from './create-structure-tile-map';
import { drawMarker } from './draw-marker';
import { drawOrbit } from './draw-orbit';
import type { MarkerCell } from './types/marker-cell';
import type { StructureScene } from './types/structure-scene';

const NO_PALETTE: Palette = {
  sky: ['', '', ''],
  hills: ['', ''],
  block: '',
  blockCap: '',
  blockCapHighlight: '',
};

const MARKERS = [STRUCTURE_START, STRUCTURE_END];

const filterMarkerCells = (grid: number[][]): MarkerCell[] =>
  pipe(
    grid,
    (rows) =>
      flatMap(rows, (cells, row) =>
        map(cells, (cell, column): MarkerCell => ({ cell, row, column })),
      ),
    (cells) => filter(cells, ({ cell }) => includes(MARKERS, cell)),
  );

export const drawStructure = (
  context: CanvasRenderingContext2D,
  sketch: Layers,
): CanvasRenderingContext2D =>
  pipe(
    sketch,
    createStructureTileMap,
    (level): StructureScene => ({
      level,
      width: level.width * TILE_SIZE,
      height: level.height * TILE_SIZE,
    }),
    (scene) =>
      tap(scene, () => context.clearRect(0, 0, scene.width, scene.height)),
    (scene) =>
      tap(scene, () =>
        drawTiles(context, scene.level, NO_PALETTE, 0, 0, {
          width: scene.width,
          height: scene.height,
          scale: 1,
        }),
      ),
    (scene) =>
      tap(scene, () =>
        map(createCannons(scene.level), (cannon) =>
          drawCannon(context, cannon),
        ),
      ),
    (scene) =>
      tap(scene, () =>
        map(createEnemies(scene.level), (enemy) =>
          drawEnemy(context, enemy, 0),
        ),
      ),
    (scene) =>
      tap(scene, () =>
        map(createFallingSpikes(scene.level), (spike) =>
          drawFallingSpike(context, spike),
        ),
      ),
    (scene) =>
      tap(scene, () =>
        map(createFireballs(scene.level), (fireball) =>
          pipe(
            fireball,
            (orbiting) => tap(orbiting, () => drawOrbit(context, orbiting)),
            (orbiting) => drawFireball(context, orbiting, 0),
          ),
        ),
      ),
    () =>
      tap(context, () =>
        map(filterMarkerCells(sketch.tiles), ({ cell, row, column }) =>
          drawMarker(context, cell, row, column),
        ),
      ),
  );
