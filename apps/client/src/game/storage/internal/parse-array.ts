import { isArray } from 'lodash-es';
import { match, P } from 'ts-pattern';

const { when } = P;

export const parseArray = (value: unknown): unknown[] =>
  match(value)
    .with(
      when((candidate): candidate is unknown[] => isArray(candidate)),
      (array) => array,
    )
    .otherwise((): unknown[] => []);
