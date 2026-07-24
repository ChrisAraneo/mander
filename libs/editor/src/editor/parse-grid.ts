import type { Structure } from '@mander/generator';
import { tryCatch } from 'ramda';
import { match, P } from 'ts-pattern';

import { normalize } from './normalize';

const parseBody: (body: string) => Structure | null = tryCatch(
  (body: string) => normalize(JSON.parse(body)),
  () => null,
);

const gridBody = (text: string): string | null =>
  match({ start: text.indexOf('['), end: text.lastIndexOf(']') })
    .with({ start: P.number.gte(0), end: P.number.gte(0) }, ({ start, end }) =>
      text.slice(start, end + 1).replaceAll(/,(?<trailing>\s*\])/gu, '$<trailing>'),
    )
    .otherwise(() => null);

export const parseGrid = (text: string): Structure | null =>
  match(gridBody(text))
    .with(P.nullish, () => null)
    .otherwise(parseBody);
