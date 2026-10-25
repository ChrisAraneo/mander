import { isFinite } from 'lodash-es';
import { match, P } from 'ts-pattern';

const { when } = P;

export const parseNumber = (value: unknown): number =>
  match(value)
    .with(
      when((candidate): candidate is number => isFinite(candidate)),
      (number) => number,
    )
    .otherwise(() => 0);
