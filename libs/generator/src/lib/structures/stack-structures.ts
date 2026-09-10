import {
  isSolidTile,
  type Layers,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
} from '@mander/model';
import {
  backOf,
  frontOf,
  type Layer,
  STRUCTURE_WIDTH,
  STRUCTURE_END,
  STRUCTURE_START,
  VERTICAL_BAND_HEIGHT,
  VERTICAL_HEIGHT,
  type Sector,
} from '@mander/structures';
import { chain } from '@mander/utils';
import { flatMap, map, range, size, take, times } from 'lodash-es';
import { match } from 'ts-pattern';
import { patchTiles, type TilePatch } from './patch-tiles';

const GROUND: Tile = TILE_DIRT;

export const GROUND_DEPTH = 3;

const isDrawn = (cell: number): boolean =>
  cell !== TILE_AIR && cell !== STRUCTURE_START && cell !== STRUCTURE_END;

const heightOf = (count: number): number =>
  (count - 1) * VERTICAL_BAND_HEIGHT + VERTICAL_HEIGHT + GROUND_DEPTH;

const bandOf = (structures: Sector[], index: number): number =>
  (size(structures) - 1 - index) * VERTICAL_BAND_HEIGHT;

const painted = (layer: Layer, band: number): TilePatch[] =>
  chain(take(layer, VERTICAL_BAND_HEIGHT))
    .flatMap((cells, row) =>
      map(cells, (cell, column) => ({
        tile: cell,
        row: band + row,
        column,
      })),
    )
    .filter(({ tile }) => isDrawn(tile))
    .value();

const sealed = (tiles: Tile[][]): TilePatch[] =>
  chain(range(size(tiles) - GROUND_DEPTH, size(tiles)))
    .flatMap((row) =>
      map(range(STRUCTURE_WIDTH), (column) => ({ row, column, tile: GROUND })),
    )
    .filter(({ row, column }) => !isSolidTile(tiles[row][column]))
    .value();

const stacked = (
  structures: Sector[],
  layerOf: (structure: Sector) => Layer,
): Tile[][] =>
  chain(
    times(heightOf(size(structures)), () =>
      times(STRUCTURE_WIDTH, (): Tile => TILE_AIR),
    ),
  )
    .thru((grid) =>
      patchTiles(
        grid,
        flatMap(structures, (structure, index) =>
          painted(layerOf(structure), bandOf(structures, index)),
        ),
      ),
    )
    .value();

export const stackStructures = (structures: Sector[]): Layers =>
  match(size(structures))
    .with(0, (): Layers => ({ tiles: [], backTiles: [] }))
    .otherwise((): Layers =>
      chain(stacked(structures, frontOf))
        .thru((tiles) => ({
          // only the front layer is sealed: the bedrock under a climb is what
          // the player stands on
          tiles: patchTiles(tiles, sealed(tiles)),
          backTiles: stacked(structures, backOf),
        }))
        .value(),
    );
