import { tap } from 'lodash-es';
import { match } from 'ts-pattern';
import { patchRef } from '../canvas';
import { startReplay } from './start-replay';
import type { ReplaySession } from './types/replay-session';

const patchReplayPause = (session: ReplaySession): ReplaySession =>
  tap(session, (current) =>
    patchRef(current.isPaused, !current.isPaused.value),
  );

export const handleReplayToggle = (session: ReplaySession): ReplaySession =>
  match(session.isFinished.value)
    .with(true, () => startReplay(session))
    .otherwise(() => patchReplayPause(session));
