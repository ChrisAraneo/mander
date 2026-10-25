import { includes } from 'lodash-es';
import { match } from 'ts-pattern';
import { addTrailingComma } from './internal/add-trailing-comma.ts';

export const addName = (list: string, name: string): string =>
  match(includes(list, '\n'))
    .with(true, () => `${addTrailingComma(list)}\n  ${name},\n`)
    .otherwise(() => `${addTrailingComma(list)} ${name} `);
