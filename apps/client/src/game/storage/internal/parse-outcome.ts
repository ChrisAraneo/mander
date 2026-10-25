import { includes } from 'lodash-es';
import { match, P } from 'ts-pattern';
import type { RunOutcome } from '../types/run-outcome';

const { when } = P;

const OUTCOMES: readonly RunOutcome[] = Object.freeze([
  'COMPLETE',
  'GAME_OVER',
  'ABANDONED',
]);

export const parseOutcome = (value: unknown): RunOutcome =>
  match(value)
    .with(
      when((candidate): candidate is RunOutcome =>
        includes(OUTCOMES, candidate),
      ),
      (outcome) => outcome,
    )
    .otherwise((): RunOutcome => 'ABANDONED');
