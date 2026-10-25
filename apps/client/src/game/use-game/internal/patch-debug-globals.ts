import { tap } from 'lodash-es';
import { match } from 'ts-pattern';
import type { Game } from '../types/game';
import { writeDebugGlobals } from './write-debug-globals';

export const patchDebugGlobals = (game: Game, target: Window): Game =>
  match(import.meta.env.DEV)
    .with(true, () =>
      tap(game, (current) => writeDebugGlobals(current, target)),
    )
    .otherwise(() => game);
