import type { Tile } from '@mander/model';
import { match } from 'ts-pattern';
import { CHEST_HEIGHT } from '../../consts';
import { filterStandingSpots } from '../../structures/filter-standing-spots';
import { filterStandingSurfaceSpots } from '../../structures/filter-standing-surface-spots';
import type { LevelType } from '../../types/level-type';
import type { ChestCandidates } from './types/chest-candidates';

export const filterChestCandidates = ({
  tiles,
  levelType,
}: {
  tiles: Tile[][];
  levelType: LevelType;
}): ChestCandidates => ({
  tiles,
  levelType,
  candidates: match(levelType)
    .with('HORIZONTAL', () => filterStandingSurfaceSpots(tiles, CHEST_HEIGHT))
    .with('VERTICAL', () => filterStandingSpots(tiles, CHEST_HEIGHT))
    .exhaustive(),
});
