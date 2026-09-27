import type { Tile } from '@mander/model';
import { filter } from 'lodash-es';
import { match } from 'ts-pattern';
import { CHEST_HEIGHT } from '../../../consts';
import { findStandingSpots } from '../../find-standing-spots';
import type { LevelType } from '../../get-level-type';
import { isSurface } from '../../is-surface';

export const findChestCandidates = ({
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
      filter(findStandingSpots(tiles, CHEST_HEIGHT), ({ row, column }) =>
        isSurface(tiles, row, column),
      ),
    )
    .with('VERTICAL', () => findStandingSpots(tiles, CHEST_HEIGHT))
    .exhaustive(),
});
