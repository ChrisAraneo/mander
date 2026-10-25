import { head, last } from 'lodash-es';

export const formatSpan = (columns: readonly number[]): string =>
  `${head(columns)}-${last(columns)}`;
