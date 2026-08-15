import type { GameState } from '@mander/engine';
import { map } from 'lodash-es';

import { paint } from '../canvas';
import { fireballStep } from './fireball-step';

export const drawFireballs = (
  context: CanvasRenderingContext2D,
  state: GameState,
): void =>
  paint(
    context,
    ...map(state.fireballs, (fireball) => fireballStep(fireball, state.time)),
  );
