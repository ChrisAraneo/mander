import { toUpper } from 'lodash-es';
import { pipe } from 'remeda';
import { createXmur3 } from './internal/create-xmur3';
import { toHashChunk } from './internal/to-hash-chunk';

export const hashString = (input: string): string =>
  pipe(
    input,
    createXmur3,
    (hash) => toHashChunk(hash()) + toHashChunk(hash()),
    toUpper,
  );
