import { maxJumpColumns } from '@mander/generator';
import type { Surfaces } from '../types/surfaces';
import { chain } from '../../../../utils/src/lib/chain';

type Surface = Surfaces[number];

export const isReachableStep = (from: Surface, target: Surface): boolean =>
  chain(Math.abs(target.col - from.col))
    .thru(
      (columnDistance) =>
        columnDistance >= 1 &&
        columnDistance <= 6 &&
        columnDistance <= maxJumpColumns(target.height - from.height),
    )
    .value();
