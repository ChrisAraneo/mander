import type { GameState } from '@mander/engine';
import { map } from 'lodash-es';

import { paint } from '../canvas';
import { createPlayerFireballStep } from './create-player-fireball-step';

export const drawPlayerFireballs = (
  context: CanvasRenderingContext2D,
  state: GameState,
): void =>
  paint(
    context,
    ...map(state.playerFireballs, (fireball) =>
      createPlayerFireballStep(fireball, state.time),
    ),
  );
