import { match } from 'ts-pattern';
import { createGroundedPatches } from './create-grounded-patches';
import { createJoinedPatches } from './create-joined-patches';
import { createPaintPatches } from './create-paint-patches';
import type { StructureLayerSplit } from './types/structure-layer-split';
import type { StructurePatch } from './types/structure-patch';

export const createStructurePatches = ({
  levelType,
  tiles,
  fronts,
  backs,
}: StructureLayerSplit): StructurePatch => ({
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
