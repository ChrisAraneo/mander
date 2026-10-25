import { endsWith, includes, isEmpty, trimEnd } from 'lodash-es';
import { match } from 'ts-pattern';

const addTrailingComma = (list: string): string =>
  match(trimEnd(list))
    .when(
      (body) => isEmpty(body) || endsWith(body, ','),
      (body) => body,
    )
    .otherwise((body) => `${body},`);

export const addName = (list: string, name: string): string =>
  match(includes(list, '\n'))
    .with(true, () => `${addTrailingComma(list)}\n  ${name},\n`)
    .otherwise(() => `${addTrailingComma(list)} ${name} `);
