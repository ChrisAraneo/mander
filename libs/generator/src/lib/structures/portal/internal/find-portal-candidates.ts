import { PORTAL_HEIGHT, type Tile } from '@mander/model';
import { filter } from 'lodash-es';
import { match } from 'ts-pattern';
import { findStandingSpots } from '../../find-standing-spots';
import type { LevelType } from '../../get-level-type';
import { isSurface } from '../../is-surface';

export const findPortalCandidates = ({
  tiles,
  levelType,
}: {
  tiles: Tile[][];
  levelType: LevelType;
}) => ({
  tiles,
  levelType,
  candidates: match(levelType)
    .with('HORIZONTAL', () =>
      filter(findStandingSpots(tiles, PORTAL_HEIGHT), ({ row, column }) =>
        isSurface(tiles, row, column),
      ),
    )
    .with('VERTICAL', () => findStandingSpots(tiles, PORTAL_HEIGHT))
    .exhaustive(),
});
