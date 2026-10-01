import type { Tile } from '@mander/model';
import { filter } from 'lodash-es';
import { match } from 'ts-pattern';
import { KEY_HEIGHT } from '../../../consts';
import { findStandingSpots } from '../../find-standing-spots';
import { isSurface } from '../../is-surface';
import type { LevelType } from '../../types/level-type';

export const findKeyCandidates = ({
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
      filter(findStandingSpots(tiles, KEY_HEIGHT), ({ row, column }) =>
        isSurface(tiles, row, column),
      ),
    )
    .with('VERTICAL', () => findStandingSpots(tiles, KEY_HEIGHT))
    .exhaustive(),
});
