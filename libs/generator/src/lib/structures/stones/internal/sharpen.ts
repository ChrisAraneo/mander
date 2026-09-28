import { map } from 'lodash-es';
import { convertToFlag } from './convert-to-flag';
import type { Field } from './field';

const STONE_SHARE = 0.5;

export const sharpen = (field: Field): Field =>
  map(field, (cells) =>
    map(cells, (share) => convertToFlag(share >= STONE_SHARE)),
  );
