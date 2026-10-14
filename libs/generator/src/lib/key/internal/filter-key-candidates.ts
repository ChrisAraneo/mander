import type { Tile } from '@mander/model';
import { match } from 'ts-pattern';
import { KEY_HEIGHT } from '../../consts';
import { filterStandingSpots } from '../../structures/filter-standing-spots';
import { filterStandingSurfaceSpots } from '../../structures/filter-standing-surface-spots';
import type { LevelType } from '../../types/level-type';
import type { KeyCandidates } from './types/key-candidates';

export const filterKeyCandidates = ({
  tiles,
  levelType,
}: {
  tiles: Tile[][];
  levelType: LevelType;
}): KeyCandidates => ({
  tiles,
  levelType,
  candidates: match(levelType)
    .with('HORIZONTAL', () => filterStandingSurfaceSpots(tiles, KEY_HEIGHT))
    .with('VERTICAL', () => filterStandingSpots(tiles, KEY_HEIGHT))
    .exhaustive(),
});
