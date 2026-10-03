import { reduce, times } from 'lodash-es';
import { blur } from './blur';
import type { Field } from './field';

const BLUR_PASSES = 2;

export const soften = (field: Field): Field =>
  reduce(times(BLUR_PASSES), (softened: Field) => blur(softened), field);
