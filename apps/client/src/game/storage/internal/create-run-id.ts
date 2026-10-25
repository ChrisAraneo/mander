import { floor, join } from 'lodash-es';

const SUFFIX_RANGE = 1e8;

const SUFFIX_BASE = 36;

const createSuffix = (random: () => number): string =>
  floor(random() * SUFFIX_RANGE).toString(SUFFIX_BASE);

export const createRunId = (
  name: string,
  playedAt: string,
  random: () => number,
): string => join([name, playedAt, createSuffix(random)], ':');
