import { type Layers, TILE_AIR } from '@mander/model';
import { getAlias } from '@mander/structures';
import { every, flatten, join, map } from 'lodash-es';
import { match } from 'ts-pattern';

const EMPTY_LAYER = '[]';

const formatRow = (row: number[], indent: string): string =>
  `${indent}[${join(
    map(row, (cell) => getAlias(cell)),
    ', ',
  )}],`;

const isBlank = (grid: number[][]): boolean =>
  every(flatten(grid), (cell) => cell === TILE_AIR);

const formatLayer = (grid: number[][]): string =>
  match(isBlank(grid))
    .with(true, () => EMPTY_LAYER)
    .otherwise(
      () =>
        `[\n${join(
          map(grid, (row) => formatRow(row, '    ')),
          '\n',
        )}\n  ]`,
    );

export const formatStructure = ({ tiles, backTiles }: Layers): string =>
  `[\n  ${formatLayer(tiles)},\n  ${formatLayer(backTiles)},\n]`;
