import { tap } from 'lodash-es';
import { pipe } from 'remeda';
import type { Observable, Subscription } from 'rxjs';
import { match, P } from 'ts-pattern';
import { initializeCanvas, patchRef } from '../../canvas';
import { createKeyboard } from '../../input';
import { writePlayedWorld, writeScore } from '../../storage';
import { type AnimationFrame, createFixedPulses } from '../../tick';
import type { Game } from '../types/game';
import { watchGame } from './watch-game';

const { nonNullable } = P;

export const startGame = (
  game: Game,
  frames: Observable<AnimationFrame>,
  target: Window,
): Subscription | null =>
  match(initializeCanvas(game.replay.stage.cell))
    .with(nonNullable, () =>
      pipe(
        game,
        (current) =>
          tap(current, () => writeScore(current.world.score, current.storage)),
        (current) =>
          tap(current, () =>
            writePlayedWorld(
              { name: current.world.name, day: current.day },
              new Date().toISOString(),
              current.storage,
            ),
          ),
        (current) => ({ game: current, keyboard: createKeyboard(target) }),
        (setup) =>
          tap(setup, () => patchRef(setup.game.keyboard, setup.keyboard)),
        (setup) =>
          patchRef(
            setup.game.subscription,
            watchGame(
              setup.game,
              setup.keyboard,
              createFixedPulses(frames),
              target,
            ),
          ),
      ),
    )
    .otherwise(() => null);
