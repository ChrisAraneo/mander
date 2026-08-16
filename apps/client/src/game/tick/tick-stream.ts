import type { Action } from '@mander/engine';
import { animationFrames, map, type Observable, pairwise } from 'rxjs';

import { TIME_SCALE } from './consts';

export const tickStream = (): Observable<Action> =>
  animationFrames().pipe(
    pairwise(),
    map(([previous, current]): Action => ({
      type: 'TICK',
      deltaSeconds:
        ((current.timestamp - previous.timestamp) / 1000) * TIME_SCALE,
    })),
  );
