import { type GameState, type PackedReplay, totalTime } from '@mander/engine';
import { chain, withEffect } from '@mander/utils';
import { assign, noop } from 'lodash-es';
import { match } from 'ts-pattern';

import { archiveRun, type FinishedRun, type RunOutcome } from '../storage';
import { MIN_ABANDONED_SECONDS } from './consts';

export interface RunSource {
  name: string;
  day: string;
  replay(): PackedReplay;
}

export interface RunArchive {
  keep(state: GameState, outcome: RunOutcome): void;
  reset(): void;
}

interface ArchiveCell {
  isKept: boolean;
}

const emptyCell = (): ArchiveCell => ({ isKept: false });

const mutate = (cell: ArchiveCell, patch: Partial<ArchiveCell>): void =>
  void assign(cell, patch);

const runSeconds = (state: GameState): number =>
  match(state.status)
    .with('COMPLETE', () => totalTime(state.levelTimes))
    .otherwise(() => totalTime(state.levelTimes) + state.time);

const isWorthKeeping = (outcome: RunOutcome, seconds: number): boolean =>
  match(outcome)
    .with('ABANDONED', () => seconds >= MIN_ABANDONED_SECONDS)
    .otherwise(() => true);

const toFinished = (
  source: RunSource,
  state: GameState,
  outcome: RunOutcome,
  seconds: number,
): FinishedRun => ({
  name: source.name,
  day: source.day,
  outcome,
  score: state.score,
  seconds,
  levelIndex: state.levelIndex,
  replay: source.replay(),
});

const keeper =
  (cell: ArchiveCell, source: RunSource) =>
  (state: GameState, outcome: RunOutcome): void =>
    chain(runSeconds(state))
      .thru((seconds) => ({
        seconds,
        isKeeping: !cell.isKept && isWorthKeeping(outcome, seconds),
      }))
      .thru(({ seconds, isKeeping }) =>
        match(isKeeping)
          .with(true, () =>
            archiveRun(
              withEffect(toFinished(source, state, outcome, seconds), () =>
                mutate(cell, { isKept: true }),
              ),
            ),
          )
          .otherwise(noop),
      )
      .value();

export const createRunArchive = (source: RunSource): RunArchive =>
  chain(emptyCell())
    .thru((cell): RunArchive => ({
      keep: keeper(cell, source),
      reset: () => mutate(cell, emptyCell()),
    }))
    .value();
