import { padStart, toUpper } from 'lodash-es';

import { createXmur3 } from './create-xmur3.ts';

export const hashString = (input: string): string => {
  const hash = createXmur3(input);

  return toUpper(
    padStart(hash().toString(36), 7, '0') +
      padStart(hash().toString(36), 7, '0'),
  );
};
