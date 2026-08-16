import { padStart, toUpper } from 'lodash-es';

import { xmur3 } from './xmur3.ts';

export const hashString = (input: string): string => {
  const hash = xmur3(input);

  return toUpper(
    padStart(hash().toString(36), 7, '0') +
      padStart(hash().toString(36), 7, '0'),
  );
};
