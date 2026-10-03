import { map } from 'lodash-es';
import type { Field } from './field';
import { toFlag } from './to-flag';

const STONE_SHARE = 0.5;

export const sharpen = (field: Field): Field =>
  map(field, (cells) => map(cells, (share) => toFlag(share >= STONE_SHARE)));
