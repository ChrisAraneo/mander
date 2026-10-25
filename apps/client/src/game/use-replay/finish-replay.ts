import { noop, tap } from 'lodash-es';
import { pipe } from 'remeda';
import { match } from 'ts-pattern';
import { patchRef } from '../canvas';
import { drawStageState } from './draw-stage-state';
import type { ReplaySession } from './types/replay-session';

const redrawReplayOrigin = (session: ReplaySession): void =>
  match(session.origin)
    .with({ kind: 'GAME' }, ({ state }) =>
      drawStageState(session.stage, state.value, []),
    )
    .with({ kind: 'ARCHIVE' }, noop)
    .exhaustive();

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
