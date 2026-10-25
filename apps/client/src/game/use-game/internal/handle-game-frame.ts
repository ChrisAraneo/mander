import { tap } from 'lodash-es';
import { pipe } from 'remeda';
import { patchRef } from '../../canvas';
import type { Game } from '../types/game';
import type { GameFrame } from '../types/game-frame';
import { finishRun } from './finish-run';
import { patchDebugGlobals } from './patch-debug-globals';
import { writeProgress } from './write-progress';

export const handleGameFrame = (
  game: Game,
  frame: GameFrame,
  target: Window,
): boolean =>
  pipe(
    { previous: game.state.value, next: frame.current },
    (step) => tap(step, () => patchRef(game.frame, frame)),
    (step) => tap(step, () => patchRef(game.state, step.next)),
    (step) => tap(step, () => patchDebugGlobals(game, target)),
    (step) => tap(step, () => writeProgress(game, step.previous, step.next)),
    (step) => finishRun(game, step.next),
  );
