import { noop } from 'lodash-es';
import { tryCatch } from 'ramda';

export const tryParseJson: (raw: string) => unknown = tryCatch(
  (raw: string): unknown => JSON.parse(raw),
  noop,
);
