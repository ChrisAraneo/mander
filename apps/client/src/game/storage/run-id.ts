import { floor } from 'lodash-es';

const SUFFIX_RANGE = 1e8;
const SUFFIX_BASE = 36;

const suffix = (): string =>
  floor(Math.random() * SUFFIX_RANGE).toString(SUFFIX_BASE);

export const runId = (name: string, playedAt: string): string =>
  [name, playedAt, suffix()].join(':');
