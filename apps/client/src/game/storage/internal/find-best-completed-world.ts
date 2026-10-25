import { isUndefined } from 'lodash-es';
import { match, P } from 'ts-pattern';
import type { CompletedWorld } from '../types/completed-world';

const { when } = P;

export const findBestCompletedWorld = (
  run: CompletedWorld,
  previous: CompletedWorld | undefined,
): CompletedWorld =>
  match(previous)
    .with(
      when(
        (earlier): earlier is CompletedWorld =>
          !isUndefined(earlier) && earlier.score >= run.score,
      ),
      (earlier) => earlier,
    )
    .otherwise(() => run);
