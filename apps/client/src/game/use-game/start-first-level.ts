import { tap } from 'lodash-es';
import { pipe } from 'remeda';
import { writeScore } from '../storage';
import { addGameAction } from './add-game-action';
import type { Game } from './types/game';

export const startFirstLevel = (game: Game): void =>
  pipe(
    game.world.levels[0],
    (level) => tap(level, () => writeScore(0, game.storage)),
    (level) => addGameAction(game, { type: 'RESTART', level }),
  );
