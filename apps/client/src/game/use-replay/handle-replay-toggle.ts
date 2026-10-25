import { match } from 'ts-pattern';
import { patchReplayPause } from './internal/patch-replay-pause';
import { startReplay } from './start-replay';
import type { ReplaySession } from './types/replay-session';

export const handleReplayToggle = (session: ReplaySession): ReplaySession =>
  match(session.isFinished.value)
    .with(true, () => startReplay(session))
    .otherwise(() => patchReplayPause(session));
