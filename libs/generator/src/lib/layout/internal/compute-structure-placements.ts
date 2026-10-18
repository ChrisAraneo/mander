import type { Sector } from '@mander/structures';
import { match } from 'ts-pattern';
import type { LevelType } from '../../types/level-type';
import { computeJoinedPlacements } from './compute-joined-placements';
import { computeStackedPlacements } from './compute-stacked-placements';
import type { StructureLayout } from './types/structure-layout';

export const computeStructurePlacements = ({
  structures,
  levelType,
}: {
  structures: Sector[];
  levelType: LevelType;
}): StructureLayout => ({
  levelType,
  placements: match(levelType)
    .with('HORIZONTAL', () => computeJoinedPlacements(structures))
    .with('VERTICAL', () => computeStackedPlacements(structures))
    .exhaustive(),
});
