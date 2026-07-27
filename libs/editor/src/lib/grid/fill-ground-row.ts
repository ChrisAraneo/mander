import {
  BLOCK,
  SECTOR_WIDTH,
  type Structure,
  STRUCTURE_HEIGHT,
} from '@mander/generator';
import { map } from 'lodash-es';
import { match } from 'ts-pattern';

export const fillGroundRow = (grid: Structure): Structure =>
  map(grid, (row, index) =>
    match(index === STRUCTURE_HEIGHT - 1)
      .with(true, () =>
        Array.from({ length: SECTOR_WIDTH }, (): number => BLOCK),
      )
      .otherwise(() => row),
  );
