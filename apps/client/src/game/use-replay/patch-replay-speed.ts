import { tap } from 'lodash-es';
import { patchRef } from '../canvas';
import { nextReplaySpeed } from './internal/next-replay-speed';
import type { ReplaySession } from './types/replay-session';

export const patchReplaySpeed = (session: ReplaySession): ReplaySession =>
  tap(session, (current) =>
    patchRef(current.speed, nextReplaySpeed(current.speed.value)),
  );
