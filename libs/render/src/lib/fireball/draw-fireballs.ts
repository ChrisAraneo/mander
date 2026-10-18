import type { GameState } from '@mander/engine';
import { map } from 'lodash-es';
import { draw } from '../canvas/draw';
import { createFireballStep } from './create-fireball-step';

export const drawFireballs = (
  context: CanvasRenderingContext2D,
  state: GameState,
): void =>
  draw(
    context,
    ...map(state.fireballs, (fireball) =>
      createFireballStep(fireball, state.time),
    ),
  );
