import { chain, join } from 'lodash-es';

import type { Structure } from '../types';

export const formatStructure = (grid: Structure): string =>
  chain(grid)
    .map((row) => `  [${join(row, ', ')}],`)
    .thru((rows) => `[\n${join(rows, '\n')}\n]`)
    .value();
