import { computeTotalTime, type GameState } from '@mander/engine';
import { match } from 'ts-pattern';

export const computeRunSeconds = (state: GameState): number =>
  match(state.status)
    .with('COMPLETE', () => computeTotalTime(state.levelTimes))
    .otherwise(() => computeTotalTime(state.levelTimes) + state.time);
