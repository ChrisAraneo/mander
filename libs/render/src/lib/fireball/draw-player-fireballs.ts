import type { GameState } from '@mander/engine';
import { map } from 'lodash-es';

import { paint } from '../canvas';
import { playerFireballStep } from './player-fireball-step';

export const drawPlayerFireballs = (
  context: CanvasRenderingContext2D,
  state: GameState,
): void =>
  paint(
    context,
    ...map(state.playerFireballs, (fireball) =>
      playerFireballStep(fireball, state.time),
    ),
  );
