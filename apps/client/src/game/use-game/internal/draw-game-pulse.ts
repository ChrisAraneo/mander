import { computeInterpolatedState } from '@mander/render';
import { noop } from 'lodash-es';
import { match } from 'ts-pattern';
import type { Pulse } from '../../tick';
import { drawStageState } from '../../use-replay';
import type { Game } from '../types/game';

export const drawGamePulse = (game: Game, pulse: Pulse): void =>
  match(game.replay.isActive.value)
    .with(true, noop)
    .otherwise(() =>
      drawStageState(
        game.replay.stage,
        computeInterpolatedState(
          game.frame.value.previous,
          game.frame.value.current,
          pulse.alpha,
        ),
        [],
      ),
    );
