import type { GameState } from '@mander/engine';
import { map } from 'lodash-es';

import { paint } from '../canvas';
import { createFireballStep } from './create-fireball-step';

export const drawFireballs = (
  context: CanvasRenderingContext2D,
  state: GameState,
): void =>
  paint(
    context,
    ...map(state.fireballs, (fireball) =>
      createFireballStep(fireball, state.time),
    ),
  );
