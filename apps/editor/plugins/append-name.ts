import { compact, includes, map, split, trim } from 'lodash-es';
import { match } from 'ts-pattern';

const withoutComments = (list: string): string =>
  list.replace(/\/\/[^\n]*/g, '');

const closed = (list: string): string =>
  match(list.replace(/\s+$/, ''))
    .when(
      (body) => body === '' || body.endsWith(','),
      (body) => body,
    )
    .otherwise((body) => `${body},`);

export const listNames = (list: string): string[] =>
  compact(map(split(withoutComments(list), ','), trim));

export const hasName = (list: string, name: string): boolean =>
  includes(listNames(list), name);

export const appendName = (list: string, name: string): string =>
  match(list.includes('\n'))
    .with(true, () => `${closed(list)}\n  ${name},\n`)
    .otherwise(() => `${closed(list)} ${name} `);
