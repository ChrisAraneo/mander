import { match } from 'ts-pattern';

export const withEndings = (source: string, original: string): string =>
  match(original.includes('\r\n'))
    .with(true, () => source.replace(/\r?\n/g, '\r\n'))
    .otherwise(() => source.replace(/\r\n/g, '\n'));
