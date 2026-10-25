import { floor } from 'lodash-es';

const SUFFIX_RANGE = 1e8;

const SUFFIX_BASE = 36;

export const createSuffix = (random: () => number): string =>
  floor(random() * SUFFIX_RANGE).toString(SUFFIX_BASE);
