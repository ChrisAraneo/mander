import { match } from 'ts-pattern';

import type { RunRecord } from '../storage';

export const runLabel = (run: RunRecord): string =>
  match(run.outcome)
    .with('COMPLETE', () => 'Finished')
    .with('GAME_OVER', () => `Died on level ${run.levelIndex + 1}`)
    .otherwise(() => `Left on level ${run.levelIndex + 1}`);
