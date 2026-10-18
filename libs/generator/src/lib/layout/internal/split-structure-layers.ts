import { getBack, getFront } from '@mander/structures';
import { map } from 'lodash-es';
import { sliceLayer } from './slice-layer';
import type { LayerPlacement } from './types/layer-placement';
import type { StructureGrid } from './types/structure-grid';
import type { StructureLayerSplit } from './types/structure-layer-split';

export const splitStructureLayers = ({
  levelType,
  placements,
  tiles,
}: StructureGrid): StructureLayerSplit => ({
  levelType,
  tiles,
  fronts: map(placements, ({ structure, row, column }): LayerPlacement => ({
    layer: sliceLayer(getFront(structure), levelType),
    row,
    column,
  })),
  backs: map(placements, ({ structure, row, column }): LayerPlacement => ({
    layer: sliceLayer(getBack(structure), levelType),
    row,
    column,
  })),
});
