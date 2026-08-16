import { isSolidTile, TILE_AIR, type Tile } from '@mander/model';
import {
  STRUCTURE_WIDTH,
  STRUCTURE_END,
  STRUCTURE_HEIGHT,
  STRUCTURE_START,
  type Structure,
} from '@mander/structures';
import { chain } from '@mander/utils';
import {
  find,
  flatMap,
  indexOf,
  last,
  map,
  max,
  min,
  range,
  reduce,
  times,
} from 'lodash-es';
import { match, P } from 'ts-pattern';
import { patchTiles, type TilePatch } from './patch-tiles';

const { nullish } = P;

interface Cell {
  row: number;
  column: number;
}

interface Placement {
  structure: Structure;
  row: number;
  column: number;
}

const DEFAULT_START: Cell = { row: STRUCTURE_HEIGHT - 1, column: 0 };
const DEFAULT_END: Cell = {
  row: STRUCTURE_HEIGHT - 1,
  column: STRUCTURE_WIDTH - 1,
};

const findMarker = (structure: Structure, marker: number): Cell | undefined =>
  find(
    map(structure, (cells, row): Cell => ({
      row,
      column: indexOf(cells, marker),
    })),
    (cell) => cell.column >= 0,
  );

const startOf = (structure: Structure): Cell =>
  findMarker(structure, STRUCTURE_START) ?? DEFAULT_START;

const endOf = (structure: Structure): Cell =>
  findMarker(structure, STRUCTURE_END) ?? DEFAULT_END;

/** Each structure hangs off the previous one's exit, entrance to exit. */
const place = (structures: Structure[]): Placement[] =>
  reduce(
    structures,
    (placed: Placement[], structure): Placement[] =>
      match(last(placed))
        .with(nullish, () => [{ structure, row: 0, column: 0 }])
        .otherwise((previous) =>
          chain({
            exit: endOf(previous.structure),
            entry: startOf(structure),
          })
            .thru(({ exit, entry }) => [
              ...placed,
              {
                structure,
                row: previous.row + exit.row - entry.row,
                column: previous.column + exit.column + 1 - entry.column,
              },
            ])
            .value(),
        ),
    [],
  );

const normalise = (placements: Placement[]): Placement[] =>
  chain({
    topRow: min(map(placements, (placement) => placement.row)) ?? 0,
    leftColumn: min(map(placements, (placement) => placement.column)) ?? 0,
  })
    .thru(({ topRow, leftColumn }) =>
      map(placements, (placement) => ({
        ...placement,
        row: placement.row - topRow,
        column: placement.column - leftColumn,
      })),
    )
    .value();

const heightOf = (placements: Placement[]): number =>
  max(map(placements, (placement) => placement.row + STRUCTURE_HEIGHT)) ?? 0;

const widthOf = (placements: Placement[]): number =>
  max(map(placements, (placement) => placement.column + STRUCTURE_WIDTH)) ?? 0;

const isDrawn = (cell: number): boolean =>
  cell !== TILE_AIR && cell !== STRUCTURE_START && cell !== STRUCTURE_END;

/** The structure's own cells, in world coordinates. */
const painted = (placement: Placement): TilePatch[] =>
  chain(placement.structure)
    .flatMap((cells, row) =>
      map(cells, (cell, column) => ({
        tile: cell,
        row: placement.row + row,
        column: placement.column + column,
      })),
    )
    .filter(({ tile }) => isDrawn(tile))
    .value();

/**
 * Extends the structure's floor down to the bottom of the joined level, so a
 * structure sitting high up does not leave a hole under it.
 */
const underpinned = (
  tiles: Tile[][],
  placement: Placement,
  height: number,
): TilePatch[] =>
  chain(placement.structure[STRUCTURE_HEIGHT - 1])
    .map((tile, column) => ({ tile, column }))
    .filter(({ tile }) => isSolidTile(tile))
    .flatMap(({ tile, column }) =>
      map(range(placement.row + STRUCTURE_HEIGHT, height), (row) => ({
        tile,
        row,
        column: placement.column + column,
      })),
    )
    .filter(({ row, column }) => tiles[row][column] === TILE_AIR)
    .value();

export const joinStructures = (structures: Structure[]): Tile[][] =>
  chain(normalise(place(structures)))
    .thru((placements) => ({
      placements,
      height: heightOf(placements),
      width: widthOf(placements),
    }))
    .thru(({ placements, height, width }) => ({
      placements,
      height,
      tiles: patchTiles(
        times(height, () => times(width, (): Tile => TILE_AIR)),
        flatMap(placements, painted),
      ),
    }))
    .thru(({ placements, height, tiles }) =>
      reduce(
        placements,
        (grid: Tile[][], placement) =>
          patchTiles(grid, underpinned(grid, placement, height)),
        tiles,
      ),
    )
    .value();
