import { includes, replace } from 'lodash-es';
import { match } from 'ts-pattern';

export const withEndings = (source: string, original: string): string =>
  match(includes(original, '\r\n'))
    .with(true, () => replace(source, /\r?\n/g, '\r\n'))
    .otherwise(() => replace(source, /\r\n/g, '\n'));
