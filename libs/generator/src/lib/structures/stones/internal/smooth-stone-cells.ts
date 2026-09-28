import { reduce, times } from 'lodash-es';
import { blur } from './blur';
import type { Field } from './field';
import type { findDeepDirt } from './find-deep-dirt';
import { multiplyFields } from './multiply-fields';
import { sharpen } from './sharpen';
import { soften } from './soften';

const BLOB_ROUNDS = 2;

export const smoothStoneCells = ({
  tiles,
  cells,
}: ReturnType<typeof findDeepDirt>) => ({
  tiles,
  cells: reduce(
    times(BLOB_ROUNDS),
    (blobs: Field) => multiplyFields(sharpen(blur(blobs)), cells),
    multiplyFields(sharpen(soften(cells)), cells),
  ),
});
