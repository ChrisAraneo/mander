import type { Sector } from '@mander/structures';
import { match } from 'ts-pattern';
import type { LevelType } from '../../types/level-type';
import { computeJoinedPlacements } from './compute-joined-placements';
import { computeStackedPlacements } from './compute-stacked-placements';

export const computeStructurePlacements = ({
  structures,
  levelType,
}: {
  structures: Sector[];
  levelType: LevelType;
}) => ({
  levelType,
  placements: match(levelType)
    .with('HORIZONTAL', () => computeJoinedPlacements(structures))
    .with('VERTICAL', () => computeStackedPlacements(structures))
    .exhaustive(),
});
