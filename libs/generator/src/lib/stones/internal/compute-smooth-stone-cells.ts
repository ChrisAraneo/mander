import { reduce, times } from 'lodash-es';
import { computeBlurredField } from './compute-blurred-field';
import { computeFieldProduct } from './compute-field-product';
import { computeSoftenedField } from './compute-softened-field';
import { toSharpenedField } from './to-sharpened-field';
import type { Field } from './types/field';
import type { StoneDeepDirtCells } from './types/stone-deep-dirt-cells';
import type { StoneSmoothCells } from './types/stone-smooth-cells';

const BLOB_ROUNDS = 2;

export const computeSmoothStoneCells = ({
  tiles,
  cells,
}: StoneDeepDirtCells): StoneSmoothCells => ({
  tiles,
  cells: reduce(
    times(BLOB_ROUNDS),
    (blobs: Field) =>
      computeFieldProduct(toSharpenedField(computeBlurredField(blobs)), cells),
    computeFieldProduct(toSharpenedField(computeSoftenedField(cells)), cells),
  ),
});
