import { map, reduce, times } from 'lodash-es';
import { STONE_FLAG } from '../../consts';
import { countCompany } from './count-company';
import { toFlag } from './to-flag';
import type { Field } from './types/field';
import type { StoneKeptCells } from './types/stone-kept-cells';
import type { StoneSmoothCells } from './types/stone-smooth-cells';

const SHED_ROUNDS = 2;

const STONE_COMPANY = 2;

export const removeLoneStones = ({
  tiles,
  cells,
}: StoneSmoothCells): StoneKeptCells => ({
  tiles,
  cells: reduce(
    times(SHED_ROUNDS),
    (kept: Field) =>
      map(kept, (flags, row) =>
        map(flags, (stone, column) =>
          toFlag(
            stone === STONE_FLAG &&
              countCompany(kept, row, column) >= STONE_COMPANY,
          ),
        ),
      ),
    cells,
  ),
});
