import { noop } from 'lodash-es';
import { match } from 'ts-pattern';
import { drawStageState } from '../draw-stage-state';
import type { ReplaySession } from '../types/replay-session';

export const redrawReplayOrigin = (session: ReplaySession): void =>
  match(session.origin)
    .with({ kind: 'GAME' }, ({ state }) =>
      drawStageState(session.stage, state.value, []),
    )
    .with({ kind: 'ARCHIVE' }, noop)
    .exhaustive();
