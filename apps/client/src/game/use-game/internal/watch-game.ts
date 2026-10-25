import { tap } from 'lodash-es';
import {
  merge,
  type Observable,
  scan,
  type Subscription,
  tap as tapStream,
} from 'rxjs';
import type { Keyboard } from '../../input';
import { createPulseTicks, type Pulse } from '../../tick';
import type { Game } from '../types/game';
import { drawGamePulse } from './draw-game-pulse';
import { handleGameFrame } from './handle-game-frame';
import { handleRecordedAction } from './handle-recorded-action';
import { nextGameFrame } from './next-game-frame';

export const watchGame = (
  game: Game,
  keyboard: Keyboard,
  pulses: Observable<Pulse>,
  target: Window,
): Subscription =>
  tap(
    merge(createPulseTicks(pulses), keyboard.actions, game.actions)
      .pipe(
        tapStream((action) => handleRecordedAction(game, action)),
        scan(
          (frame, action) =>
            nextGameFrame(frame, action, () => performance.now()),
          game.frame.value,
        ),
      )
      .subscribe((frame) => handleGameFrame(game, frame, target)),
    (subscription) =>
      subscription.add(pulses.subscribe((pulse) => drawGamePulse(game, pulse))),
  );
