import { tap } from 'lodash-es';
import { pipe } from 'remeda';
import { patchRef } from '../canvas';
import { redrawReplayOrigin } from './internal/redraw-replay-origin';
import type { ReplaySession } from './types/replay-session';

export const finishReplay = (session: ReplaySession): ReplaySession =>
  pipe(
    session,
    (current) => tap(current, () => current.subscription.value?.unsubscribe()),
    (current) => tap(current, () => patchRef(current.subscription, null)),
    (current) => tap(current, () => patchRef(current.frame, null)),
    (current) => tap(current, () => patchRef(current.ghosts, [])),
    (current) => tap(current, () => patchRef(current.isActive, false)),
    (current) => tap(current, () => redrawReplayOrigin(current)),
  );
