import { reduce, times } from 'lodash-es';
import { computeBlurredField } from './compute-blurred-field';
import type { Field } from './field';

const BLUR_PASSES = 2;

export const computeSoftenedField = (field: Field): Field =>
  reduce(
    times(BLUR_PASSES),
    (softened: Field) => computeBlurredField(softened),
    field,
  );
