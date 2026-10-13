import { reduce, times } from 'lodash-es';
import { computeBlurredField } from './compute-blurred-field';
import type { computeDeepDirtCells } from './compute-deep-dirt-cells';
import { computeFieldProduct } from './compute-field-product';
import { computeSoftenedField } from './compute-softened-field';
import type { Field } from './field';
import { toSharpenedField } from './to-sharpened-field';

const BLOB_ROUNDS = 2;

export const computeSmoothStoneCells = ({
  tiles,
  cells,
}: ReturnType<typeof computeDeepDirtCells>) => ({
  tiles,
  cells: reduce(
    times(BLOB_ROUNDS),
    (blobs: Field) =>
      computeFieldProduct(toSharpenedField(computeBlurredField(blobs)), cells),
    computeFieldProduct(toSharpenedField(computeSoftenedField(cells)), cells),
  ),
});
