import type { GameState } from '@mander/engine';
import type { Ghost } from '@mander/render';
import { chain } from '@mander/utils';
import { filter, map } from 'lodash-es';

export const levelGhosts = (state: GameState, ghosts: GameState[]): Ghost[] =>
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
