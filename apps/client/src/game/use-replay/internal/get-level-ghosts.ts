import type { GameState } from '@mander/engine';
import type { Ghost } from '@mander/render';
import { filter, map } from 'lodash-es';
import { pipe } from 'remeda';

export const getLevelGhosts = (
  state: GameState,
  ghosts: GameState[],
): Ghost[] =>
  pipe(
    ghosts,
    (all) => filter(all, (ghost) => ghost.levelIndex === state.levelIndex),
    (sameLevel) =>
      map(sameLevel, (ghost): Ghost => ({
        player: ghost.player,
        time: ghost.time,
      })),
  );
