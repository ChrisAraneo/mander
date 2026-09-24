import { TILE_PORTAL } from '@mander/model';
import { map } from 'lodash-es';
import { match, P } from 'ts-pattern';
import type { findPortalCandidate } from './find-portal-candidate';

const { nullish } = P;

export const createPortalPatches = ({
  tiles,
  found,
}: ReturnType<typeof findPortalCandidate>) => ({
  tiles,
  patches: match(found)
    .with(nullish, () => [])
    .otherwise(({ column, rows }) =>
      map(rows, (row) => ({
        row,
        column,
        tile: TILE_PORTAL,
      })),
    ),
});
