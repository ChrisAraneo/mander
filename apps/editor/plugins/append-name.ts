import {
  compact,
  endsWith,
  includes,
  isEmpty,
  map,
  replace,
  split,
  trim,
  trimEnd,
} from 'lodash-es';
import { match } from 'ts-pattern';

const withoutComments = (list: string): string =>
  replace(list, /\/\/[^\n]*/g, '');

const closed = (list: string): string =>
  match(trimEnd(list))
    .when(
      (body) => isEmpty(body) || endsWith(body, ','),
      (body) => body,
    )
    .otherwise((body) => `${body},`);

export const listNames = (list: string): string[] =>
  compact(map(split(withoutComments(list), ','), trim));

export const hasName = (list: string, name: string): boolean =>
  includes(listNames(list), name);

export const appendName = (list: string, name: string): string =>
  match(includes(list, '\n'))
    .with(true, () => `${closed(list)}\n  ${name},\n`)
    .otherwise(() => `${closed(list)} ${name} `);
