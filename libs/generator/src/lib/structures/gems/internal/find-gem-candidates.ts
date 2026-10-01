import type { Tile } from '@mander/model';
import type { createRandom } from '@mander/utils';
import { filter } from 'lodash-es';
import { match } from 'ts-pattern';
import { GEM_REST_HEIGHT } from '../../../consts';
import { findStandingSpots } from '../../find-standing-spots';
import { isSurface } from '../../is-surface';
import type { LevelType } from '../../types/level-type';

const AIR_ABOVE_GEM = 1;

const GEM_CLEARANCE = GEM_REST_HEIGHT + AIR_ABOVE_GEM;

export const findGemCandidates = ({
  tiles,
  levelType,
  random,
}: {
  tiles: Tile[][];
  levelType: LevelType;
  random: ReturnType<typeof createRandom>;
}) => ({
  tiles,
  levelType,
  random,
  candidates: match(levelType)
    .with('HORIZONTAL', () =>
      filter(findStandingSpots(tiles, GEM_CLEARANCE), ({ row, column }) =>
        isSurface(tiles, row, column),
      ),
    )
    .with('VERTICAL', () => findStandingSpots(tiles, GEM_CLEARANCE))
    .exhaustive(),
});
