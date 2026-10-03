import { match } from 'ts-pattern';
import { createGroundedPatches } from './create-grounded-patches';
import { createJoinedPatches } from './create-joined-patches';
import { createPaintPatches } from './create-paint-patches';
import type { splitStructureLayers } from './split-structure-layers';

export const createStructurePatches = ({
  levelType,
  tiles,
  fronts,
  backs,
}: ReturnType<typeof splitStructureLayers>) => ({
  tiles,
  frontPatches: match(levelType)
    .with('HORIZONTAL', () => createJoinedPatches(tiles, fronts))
    .with('VERTICAL', () => createGroundedPatches(tiles, fronts))
    .exhaustive(),
  backPatches: match(levelType)
    .with('HORIZONTAL', () => createJoinedPatches(tiles, backs))
    .with('VERTICAL', () => createPaintPatches(backs))
    .exhaustive(),
});
