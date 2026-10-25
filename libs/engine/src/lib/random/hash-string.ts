import { padStart, toUpper } from 'lodash-es';
import { pipe } from 'remeda';
import { createXmur3 } from './internal/create-xmur3';

const toHashChunk = (value: number): string =>
  padStart(value.toString(36), 7, '0');

export const hashString = (input: string): string =>
  pipe(
    input,
    createXmur3,
    (hash) => toHashChunk(hash()) + toHashChunk(hash()),
    toUpper,
  );
