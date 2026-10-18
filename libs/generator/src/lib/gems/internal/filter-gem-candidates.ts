import type { createRandom } from '@mander/engine';
import type { Tile } from '@mander/model';
import { match } from 'ts-pattern';
import { GEM_REST_HEIGHT } from '../../consts';
import { filterStandingSpots } from '../../structures/filter-standing-spots';
import { filterStandingSurfaceSpots } from '../../structures/filter-standing-surface-spots';
import type { LevelType } from '../../types/level-type';
import type { GemCandidates } from './types/gem-candidates';

const AIR_ABOVE_GEM = 1;

const GEM_CLEARANCE = GEM_REST_HEIGHT + AIR_ABOVE_GEM;

export const filterGemCandidates = ({
  tiles,
  levelType,
  random,
}: {
  tiles: Tile[][];
  levelType: LevelType;
  random: ReturnType<typeof createRandom>;
}): GemCandidates => ({
  tiles,
  levelType,
  candidates: match(levelType)
    .with('HORIZONTAL', () => filterStandingSurfaceSpots(tiles, GEM_CLEARANCE))
    .with('VERTICAL', () => filterStandingSpots(tiles, GEM_CLEARANCE))
    .exhaustive(),
  random,
});
