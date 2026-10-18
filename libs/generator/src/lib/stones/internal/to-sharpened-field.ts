import { map } from 'lodash-es';
import { toFlag } from './to-flag';
import type { Field } from './types/field';

const STONE_SHARE = 0.5;

export const toSharpenedField = (field: Field): Field =>
  map(field, (cells) => map(cells, (share) => toFlag(share >= STONE_SHARE)));
