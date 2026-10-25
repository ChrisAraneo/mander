import { isString } from 'lodash-es';
import { match, P } from 'ts-pattern';

const { when } = P;

export const parseString = (value: unknown): string =>
  match(value)
    .with(
      when((candidate): candidate is string => isString(candidate)),
      (text) => text,
    )
    .otherwise(() => '');
