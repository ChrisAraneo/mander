import { match } from 'ts-pattern';
import { createAirGrid } from '../../structures/create-air-grid';
import { computeGridWidth } from './compute-grid-width';
import { computeJoinedHeight } from './compute-joined-height';
import { computeStackedHeight } from './compute-stacked-height';
import type { computeStructurePlacements } from './compute-structure-placements';

export const createStructureGrid = ({
  levelType,
  placements,
}: ReturnType<typeof computeStructurePlacements>) => ({
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
