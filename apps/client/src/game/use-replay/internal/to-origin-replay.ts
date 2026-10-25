import { type Replay, toReplay } from '@mander/engine';
import { match } from 'ts-pattern';
import type { ReplayOrigin } from '../types/replay-origin';

export const toOriginReplay = (origin: ReplayOrigin): Replay =>
  match(origin)
    .with({ kind: 'GAME' }, ({ recorder }) => toReplay(recorder.value))
    .with({ kind: 'ARCHIVE' }, ({ recording }) => recording)
    .exhaustive();
