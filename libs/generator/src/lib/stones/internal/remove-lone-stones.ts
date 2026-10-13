import { map, reduce, times } from 'lodash-es';
import type { computeSmoothStoneCells } from './compute-smooth-stone-cells';
import { countCompany } from './count-company';
import type { Field } from './field';
import { toFlag } from './to-flag';

const SHED_ROUNDS = 2;

const STONE_COMPANY = 2;

export const removeLoneStones = ({
  tiles,
  cells,
}: ReturnType<typeof computeSmoothStoneCells>) => ({
  tiles,
  cells: reduce(
    times(SHED_ROUNDS),
    (kept: Field) =>
      map(kept, (flags, row) =>
        map(flags, (stone, column) =>
          toFlag(
            stone === 1 && countCompany(kept, row, column) >= STONE_COMPANY,
          ),
        ),
      ),
    cells,
  ),
});
