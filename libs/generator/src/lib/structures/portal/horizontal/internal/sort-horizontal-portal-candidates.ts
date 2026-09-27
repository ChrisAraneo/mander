import { chain } from '@mander/utils';
import { indexOf, size, sortBy } from 'lodash-es';
import { match } from 'ts-pattern';
import type { findHorizontalPortalCandidates } from './find-horizontal-portal-candidates';

const PREFERRED_PORTAL_OFFSETS = [1, 2, 3, 0];

export const sortHorizontalPortalCandidates = ({
  tiles,
  candidates,
}: ReturnType<typeof findHorizontalPortalCandidates>) => ({
  tiles,
  candidates: sortBy(candidates, ({ column }) =>
    chain(size(tiles[0]) - 1 - column)
      .thru((offset) =>
        match(indexOf(PREFERRED_PORTAL_OFFSETS, offset))
          .when(
            (priority) => priority === -1,
            () => offset,
          )
          .otherwise((priority) => priority),
      )
      .value(),
  ),
});
