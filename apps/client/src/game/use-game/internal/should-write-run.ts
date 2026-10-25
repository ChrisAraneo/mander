import { match } from 'ts-pattern';
import type { RunOutcome } from '../../storage';
import { MIN_ABANDONED_SECONDS } from '../consts';

export const shouldWriteRun = (
  isSaved: boolean,
  outcome: RunOutcome,
  seconds: number,
): boolean =>
  !isSaved &&
  match(outcome)
    .with('ABANDONED', () => seconds >= MIN_ABANDONED_SECONDS)
    .otherwise(() => true);
