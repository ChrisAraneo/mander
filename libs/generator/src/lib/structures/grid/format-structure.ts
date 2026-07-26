import { join } from 'lodash-es';
import { chain } from '@mander/utils';

import type { Structure } from '../types';

export const formatStructure = (grid: Structure): string =>
  chain(grid)
    .map((row) => `  [${join(row, ', ')}],`)
    .thru((rows) => `[\n${join(rows, '\n')}\n]`)
    .value();
