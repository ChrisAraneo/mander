import { noop } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { addGameAction } from './add-game-action';
import { tryCreateLevelAction } from './internal/try-create-level-action';
import type { Game } from './types/game';

const { nullish } = P;

export const startNextLevel = (game: Game): void =>
  match(
    tryCreateLevelAction(game.world.levels, game.state.value.levelIndex + 1),
  )
    .with(nullish, noop)
    .otherwise((action) => addGameAction(game, action));
