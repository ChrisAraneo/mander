import { map, reduce, times } from 'lodash-es';
import { convertToFlag } from './convert-to-flag';
import { countCompany } from './count-company';
import type { Field } from './field';
import type { smoothStoneCells } from './smooth-stone-cells';

const SHED_ROUNDS = 2;

const STONE_COMPANY = 2;

export const clearLoneStones = ({
  tiles,
  cells,
}: ReturnType<typeof smoothStoneCells>) => ({
  tiles,
  cells: reduce(
    times(SHED_ROUNDS),
    (kept: Field) =>
      map(kept, (flags, row) =>
        map(flags, (stone, column) =>
          convertToFlag(
            stone === 1 && countCompany(kept, row, column) >= STONE_COMPANY,
          ),
        ),
      ),
    cells,
  ),
});
