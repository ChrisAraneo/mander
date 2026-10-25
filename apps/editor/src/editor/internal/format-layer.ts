import { join, map } from 'lodash-es';
import { match } from 'ts-pattern';
import { formatRow } from './format-row';
import { isBlank } from './is-blank';

const EMPTY_LAYER = '[]';

export const formatLayer = (grid: number[][]): string =>
  match(isBlank(grid))
    .with(true, () => EMPTY_LAYER)
    .otherwise(
      () =>
        `[\n${join(
          map(grid, (row) => formatRow(row, '    ')),
          '\n',
        )}\n  ]`,
    );
