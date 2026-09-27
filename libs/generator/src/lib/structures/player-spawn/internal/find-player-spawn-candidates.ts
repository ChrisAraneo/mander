import type { Tile } from '@mander/model';
import { match } from 'ts-pattern';
import type { LevelType } from '../../get-level-type';
import { findHeadroomSpots } from './find-headroom-spots';
import { findSurfaceSpots } from './find-surface-spots';

export const findPlayerSpawnCandidates = ({
  tiles,
  levelType,
}: {
  tiles: Tile[][];
  levelType: LevelType;
}) => ({
  tiles,
  levelType,
  candidates: match(levelType)
    .with('HORIZONTAL', () => findSurfaceSpots(tiles))
    .with('VERTICAL', () => findHeadroomSpots(tiles))
    .exhaustive(),
});
