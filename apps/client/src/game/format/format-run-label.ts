import { match } from 'ts-pattern';
import type { RunRecord } from '../storage';

export const formatRunLabel = (run: RunRecord): string =>
  match(run.outcome)
    .with('COMPLETE', () => 'Finished')
    .with('GAME_OVER', () => `Died on level ${run.levelIndex + 1}`)
    .with('ABANDONED', () => `Left on level ${run.levelIndex + 1}`)
    .exhaustive();
