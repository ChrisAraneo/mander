import { match } from 'ts-pattern';
import { createAirGrid } from './create-air-grid';
import type { findStructurePlacements } from './find-structure-placements';
import { measureGridWidth } from './measure-grid-width';
import { measureJoinedHeight } from './measure-joined-height';
import { measureStackedHeight } from './measure-stacked-height';

export const createStructureGrid = ({
  levelType,
  placements,
}: ReturnType<typeof findStructurePlacements>) => ({
  levelType,
  placements,
  tiles: createAirGrid(
    match(levelType)
      .with('HORIZONTAL', () => measureJoinedHeight(placements))
      .with('VERTICAL', () => measureStackedHeight(placements))
      .exhaustive(),
    measureGridWidth(placements),
  ),
});
