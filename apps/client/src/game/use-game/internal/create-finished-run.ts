import type { GameState, PackedReplay } from '@mander/engine';
import type { FinishedRun, RunOutcome } from '../../storage';

export const createFinishedRun = (
  state: GameState,
  outcome: RunOutcome,
  seconds: number,
  name: string,
  day: string,
  replay: PackedReplay,
): FinishedRun => ({
  name,
  day,
  outcome,
  score: state.score,
  seconds,
  levelIndex: state.levelIndex,
  replay,
});
