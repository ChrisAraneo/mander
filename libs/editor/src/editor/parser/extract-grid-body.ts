import { match, P } from 'ts-pattern';

export const extractGridBody = (text: string): string | null =>
  match({ start: text.indexOf('['), end: text.lastIndexOf(']') })
    .with({ start: P.number.gte(0), end: P.number.gte(0) }, ({ start, end }) =>
      text
        .slice(start, end + 1)
        .replaceAll(/,(?<trailing>\s*\])/gu, '$<trailing>'),
    )
    .otherwise(() => null);
