import { chain } from '@mander/utils';
import { join, map, padStart, range } from 'lodash-es';
import { hashString } from '@mander/utils';

const pad2 = (value: number): string => padStart(String(value), 2, '0');

export const computeLevelSeeds = (date: Date): string[] =>
  chain(date)
    .thru((date) =>
      map(range(8), (number: number) =>
        hashString(
          `${join(
            [
              date.getUTCFullYear(),
              pad2(date.getUTCMonth() + 1),
              pad2(date.getUTCDate()),
            ],
            '-',
          )}#${number}`,
        ),
      ),
    )
    .value();
