import { match } from 'ts-pattern';
import { computeGridWidth } from './compute-grid-width';
import { computeJoinedHeight } from './compute-joined-height';
import { computeStackedHeight } from './compute-stacked-height';
import { createAirGrid } from './create-air-grid';
import type { findStructurePlacements } from './find-structure-placements';

export const createStructureGrid = ({
  levelType,
  placements,
}: ReturnType<typeof findStructurePlacements>) => ({
  levelType,
  placements,
  tiles: createAirGrid(
    match(levelType)
      .with('HORIZONTAL', () => computeJoinedHeight(placements))
      .with('VERTICAL', () => computeStackedHeight(placements))
      .exhaustive(),
    computeGridWidth(placements),
  ),
});
