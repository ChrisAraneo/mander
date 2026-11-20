import { padStart } from 'lodash-es';

const CHUNK_RADIX = 36;

const CHUNK_WIDTH = 7;

const CHUNK_PAD = '0';

export const toHashChunk = (value: number): string =>
  padStart(value.toString(CHUNK_RADIX), CHUNK_WIDTH, CHUNK_PAD);
