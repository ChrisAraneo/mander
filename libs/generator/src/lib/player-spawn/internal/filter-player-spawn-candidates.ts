import type { Tile } from '@mander/model';
import { match } from 'ts-pattern';
import type { LevelType } from '../../types/level-type';
import { filterHeadroomSpots } from './filter-headroom-spots';
import { filterSurfaceSpots } from './filter-surface-spots';
import type { PlayerSpawnCandidates } from './types/player-spawn-candidates';

export const filterPlayerSpawnCandidates = ({
  tiles,
  levelType,
}: {
  tiles: Tile[][];
  levelType: LevelType;
}): PlayerSpawnCandidates => ({
  tiles,
  levelType,
  candidates: match(levelType)
    .with('HORIZONTAL', () => filterSurfaceSpots(tiles))
    .with('VERTICAL', () => filterHeadroomSpots(tiles))
    .exhaustive(),
});
