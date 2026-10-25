import { tap } from 'lodash-es';
import { patchRef } from '../../canvas';
import type { ReplaySession } from '../types/replay-session';

export const patchReplayPause = (session: ReplaySession): ReplaySession =>
  tap(session, (current) =>
    patchRef(current.isPaused, !current.isPaused.value),
  );
