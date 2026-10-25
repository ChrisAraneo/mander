import { find } from 'lodash-es';
import { match, P } from 'ts-pattern';
import type { CompletedWorld } from '../types/completed-world';
import type { RunRecord } from '../types/run-record';

const { nonNullable } = P;

export const createMissingBestRuns = (
  completed: CompletedWorld | null,
  runs: RunRecord[],
): RunRecord[] =>
  match(completed)
    .with({ replay: nonNullable }, (world) =>
      match(find(runs, { id: world.runId }))
        .with(nonNullable, (): RunRecord[] => [])
        .otherwise((): RunRecord[] => [
          {
            id: `${world.name}:best`,
            name: world.name,
            day: world.day,
            playedAt: '',
            outcome: 'COMPLETE',
            score: world.score,
            seconds: world.seconds,
            levelIndex: 0,
            replay: world.replay,
          },
        ]),
    )
    .otherwise((): RunRecord[] => []);
