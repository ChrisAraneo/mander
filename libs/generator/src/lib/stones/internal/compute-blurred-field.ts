import { flow } from 'lodash-es';
import { computeBlurredColumns } from './compute-blurred-columns';
import { computeBlurredRows } from './compute-blurred-rows';
import type { Field } from './types/field';

export const computeBlurredField: (field: Field) => Field = flow(
  computeBlurredRows,
  computeBlurredColumns,
);
