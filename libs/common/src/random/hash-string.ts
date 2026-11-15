import { toUpper } from 'lodash-es';
import { pipe } from 'remeda';
import { createXmur3 } from './internal/create-xmur3';
import { toHashChunks } from './internal/to-hash-chunks';

export const hashString = (input: string): string =>
  pipe(input, createXmur3, toHashChunks, toUpper);
