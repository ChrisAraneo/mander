import { tap } from 'lodash-es';
import { onUnmounted } from 'vue';
import { createReplaySession } from './create-replay-session';
import { unwatchReplay } from './internal/unwatch-replay';
import type { ReplayOrigin } from './types/replay-origin';
import type { ReplaySession } from './types/replay-session';
import type { ReplayStage } from './types/replay-stage';

export const useReplay = (
  origin: ReplayOrigin,
  stage: ReplayStage,
): ReplaySession =>
  tap(createReplaySession(origin, stage), (session) =>
    onUnmounted(() => unwatchReplay(session)),
  );
