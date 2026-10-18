import { PORTAL_HEIGHT, type Tile } from '@mander/model';
import { match } from 'ts-pattern';
import { filterStandingSpots } from '../../structures/filter-standing-spots';
import { filterStandingSurfaceSpots } from '../../structures/filter-standing-surface-spots';
import type { LevelType } from '../../types/level-type';
import type { PortalCandidates } from './types/portal-candidates';

export const filterPortalCandidates = ({
  tiles,
  levelType,
}: {
  tiles: Tile[][];
  levelType: LevelType;
}): PortalCandidates => ({
  tiles,
  levelType,
  candidates: match(levelType)
    .with('HORIZONTAL', () => filterStandingSurfaceSpots(tiles, PORTAL_HEIGHT))
    .with('VERTICAL', () => filterStandingSpots(tiles, PORTAL_HEIGHT))
    .exhaustive(),
});
