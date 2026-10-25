import { compact, map, replace, split, trim } from 'lodash-es';
import { pipe } from 'remeda';

const LINE_COMMENT = /\/\/[^\n]*/g;

export const splitNames = (list: string): string[] =>
  pipe(
    replace(list, LINE_COMMENT, ''),
    (uncommented) => split(uncommented, ','),
    (names) => compact(map(names, trim)),
  );
