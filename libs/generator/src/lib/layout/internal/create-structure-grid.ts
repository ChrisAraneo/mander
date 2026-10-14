import { match } from 'ts-pattern';
import { createAirGrid } from '../../structures/create-air-grid';
import { computeGridWidth } from './compute-grid-width';
import { computeJoinedHeight } from './compute-joined-height';
import { computeStackedHeight } from './compute-stacked-height';
import type { StructureGrid } from './types/structure-grid';
import type { StructureLayout } from './types/structure-layout';

export const createStructureGrid = ({
  levelType,
  placements,
}: StructureLayout): StructureGrid => ({
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
