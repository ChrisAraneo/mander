import { includes } from 'lodash-es';

import { BLOCK_CELLS } from './block-cells';

export const isBlockCell = (cell: number): boolean =>
  includes(BLOCK_CELLS, cell);
