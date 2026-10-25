import { endsWith, isEmpty, trimEnd } from 'lodash-es';
import { match } from 'ts-pattern';

export const addTrailingComma = (list: string): string =>
  match(trimEnd(list))
    .when(
      (body) => isEmpty(body) || endsWith(body, ','),
      (body) => body,
    )
    .otherwise((body) => `${body},`);
