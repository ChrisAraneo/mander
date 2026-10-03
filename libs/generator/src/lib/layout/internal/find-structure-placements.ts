import type { Sector } from '@mander/structures';
import { match } from 'ts-pattern';
import type { LevelType } from '../../types/level-type';
import { findJoinedPlacements } from './find-joined-placements';
import { findStackedPlacements } from './find-stacked-placements';

export const findStructurePlacements = ({
  structures,
  levelType,
}: {
  structures: Sector[];
  levelType: LevelType;
}) => ({
  levelType,
  placements: match(levelType)
    .with('HORIZONTAL', () => findJoinedPlacements(structures))
    .with('VERTICAL', () => findStackedPlacements(structures))
    .exhaustive(),
});
