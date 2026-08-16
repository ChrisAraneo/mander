import { chain } from '@mander/utils';
import { padStart, range } from 'lodash-es';
import { hashString } from '@mander/utils';

const pad2 = (value: number): string => padStart(String(value), 2, '0');

export const computeLevelSeeds = (date: Date): string[] =>
  chain(date)
    .thru((date) =>
      range(8).map((number: number) =>
        hashString(
          `${[
            date.getUTCFullYear(),
            pad2(date.getUTCMonth() + 1),
            pad2(date.getUTCDate()),
          ].join('-')}#${number}`,
        ),
      ),
    )
    .value();
