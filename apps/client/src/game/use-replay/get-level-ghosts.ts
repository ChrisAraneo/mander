import type { GameState } from '@mander/engine';
import { chain } from '@mander/model';
import type { Ghost } from '@mander/render';
import { filter, map } from 'lodash-es';

export const getLevelGhosts = (
  state: GameState,
  ghosts: GameState[],
): Ghost[] =>
  chain(ghosts)
    .thru((all) =>
      filter(all, (ghost) => ghost.levelIndex === state.levelIndex),
    )
    .thru((sameLevel) =>
      map(sameLevel, (ghost): Ghost => ({
        player: ghost.player,
        time: ghost.time,
      })),
    )
    .value();
