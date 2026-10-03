import type { Tile } from '@mander/model';
import { filter } from 'lodash-es';
import { match } from 'ts-pattern';
import { CHEST_HEIGHT } from '../../consts';
import { findStandingSpots } from '../../structures/find-standing-spots';
import { isSurface } from '../../structures/is-surface';
import type { LevelType } from '../../types/level-type';

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
