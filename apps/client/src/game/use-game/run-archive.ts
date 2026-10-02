import {
  computeTotalTime,
  type GameState,
  type PackedReplay,
} from '@mander/engine';
import { chain, tapEffect } from '@mander/utils';
import { assign, noop } from 'lodash-es';
import { match } from 'ts-pattern';

import { archiveRun, type FinishedRun, type RunOutcome } from '../storage';
import { MIN_ABANDONED_SECONDS } from './consts';

export interface RunSource {
  name: string;
  day: string;
  getReplay(): PackedReplay;
}

export interface RunArchive {
  save(state: GameState, outcome: RunOutcome): void;
  reset(): void;
}

interface ArchiveCell {
  isSaved: boolean;
}

const createEmptyCell = (): ArchiveCell => ({ isSaved: false });

const mutate = (cell: ArchiveCell, patch: Partial<ArchiveCell>): void =>
  void assign(cell, patch);

const countRunSeconds = (state: GameState): number =>
  match(state.status)
    .with('COMPLETE', () => computeTotalTime(state.levelTimes))
    .otherwise(() => computeTotalTime(state.levelTimes) + state.time);

const isWorthSaving = (outcome: RunOutcome, seconds: number): boolean =>
  match(outcome)
    .with('ABANDONED', () => seconds >= MIN_ABANDONED_SECONDS)
    .otherwise(() => true);

const createFinishedRun = (
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
  replay: source.getReplay(),
});

const createSaver =
  (cell: ArchiveCell, source: RunSource) =>
  (state: GameState, outcome: RunOutcome): void =>
    chain(countRunSeconds(state))
      .thru((seconds) => ({
        seconds,
        isSaving: !cell.isSaved && isWorthSaving(outcome, seconds),
      }))
      .thru(({ seconds, isSaving }) =>
        match(isSaving)
          .with(true, () =>
            archiveRun(
              tapEffect(
                createFinishedRun(source, state, outcome, seconds),
                () => mutate(cell, { isSaved: true }),
              ),
            ),
          )
          .otherwise(noop),
      )
      .value();

export const createRunArchive = (source: RunSource): RunArchive =>
  chain(createEmptyCell())
    .thru((cell): RunArchive => ({
      save: createSaver(cell, source),
      reset: () => mutate(cell, createEmptyCell()),
    }))
    .value();
