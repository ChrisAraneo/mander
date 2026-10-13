import { computeBlurredColumns } from './compute-blurred-columns';
import { computeBlurredRows } from './compute-blurred-rows';
import type { Field } from './field';

export const computeBlurredField = (field: Field): Field =>
  computeBlurredColumns(computeBlurredRows(field));
