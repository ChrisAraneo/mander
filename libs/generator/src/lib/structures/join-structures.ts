import { isSolidTile, TILE_AIR, type Tile } from '@mander/model';
import {
  STRUCTURE_WIDTH,
  STRUCTURE_END,
  STRUCTURE_HEIGHT,
  STRUCTURE_START,
  type Structure,
} from '@mander/structures';
import {
  find,
  forEach,
  indexOf,
  last,
  map,
  max,
  min,
  range,
  reduce,
  times,
} from 'lodash-es';

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

const place = (structures: Structure[]): Placement[] =>
  reduce(
    structures,
    (placed: Placement[], structure): Placement[] => {
      const previous = last(placed);
      if (previous === undefined) return [{ structure, row: 0, column: 0 }];

      const exit = endOf(previous.structure);
      const entry = startOf(structure);

      return [
        ...placed,
        {
          structure,
          row: previous.row + exit.row - entry.row,
          column: previous.column + exit.column + 1 - entry.column,
        },
      ];
    },
    [],
  );

const normalise = (placements: Placement[]): Placement[] => {
  const topRow = min(map(placements, (placement) => placement.row)) ?? 0;
  const leftColumn = min(map(placements, (placement) => placement.column)) ?? 0;

  return map(placements, (placement) => ({
    ...placement,
    row: placement.row - topRow,
    column: placement.column - leftColumn,
  }));
};

const heightOf = (placements: Placement[]): number =>
  max(map(placements, (placement) => placement.row + STRUCTURE_HEIGHT)) ?? 0;

const widthOf = (placements: Placement[]): number =>
  max(map(placements, (placement) => placement.column + STRUCTURE_WIDTH)) ?? 0;

const isDrawn = (cell: number): boolean =>
  cell !== TILE_AIR && cell !== STRUCTURE_START && cell !== STRUCTURE_END;

const paint = (tiles: number[][], placement: Placement): void => {
  forEach(placement.structure, (cells, row) =>
    forEach(cells, (cell, column) => {
      if (!isDrawn(cell)) return;
      tiles[placement.row + row][placement.column + column] = cell;
    }),
  );
};

const underpin = (
  tiles: number[][],
  placement: Placement,
  height: number,
): void => {
  forEach(placement.structure[STRUCTURE_HEIGHT - 1], (cell, column) => {
    if (!isSolidTile(cell)) return;
    forEach(range(placement.row + STRUCTURE_HEIGHT, height), (row) => {
      if (tiles[row][placement.column + column] !== TILE_AIR) return;
      tiles[row][placement.column + column] = cell;
    });
  });
};

export const joinStructures = (structures: Structure[]): Tile[][] => {
  const placements = normalise(place(structures));
  const height = heightOf(placements);
  const width = widthOf(placements);
  const tiles = times(height, () => times(width, (): number => TILE_AIR));

  forEach(placements, (placement) => paint(tiles, placement));
  forEach(placements, (placement) => underpin(tiles, placement, height));

  return tiles;
};
