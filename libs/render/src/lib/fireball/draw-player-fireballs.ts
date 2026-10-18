import type { GameState } from '@mander/engine';
import { map } from 'lodash-es';
import { draw } from '../canvas/draw';
import { createPlayerFireballStep } from './create-player-fireball-step';

export const drawPlayerFireballs = (
  context: CanvasRenderingContext2D,
  state: GameState,
): void =>
  draw(
    context,
    ...map(state.playerFireballs, (fireball) =>
      createPlayerFireballStep(fireball, state.time),
    ),
  );
