import { AIR } from '@mander/generator';
import { match } from 'ts-pattern';

import type { Cell } from '../types/cell';
import type { State } from '../types/state';

export const nextPaintValue = (state: State, cell: Cell): number =>
  match(state.grid[cell.row][cell.column] === state.tool)
    .with(true, (): number => AIR)
    .otherwise((): number => state.tool);
