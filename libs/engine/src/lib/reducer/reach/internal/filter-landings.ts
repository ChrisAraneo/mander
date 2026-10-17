import type { Player } from '@mander/model';
import { filter, uniqBy } from 'lodash-es';
import { hashPlayerNode } from './hash-player-node';

export const filterLandings = (
  visited: ReadonlySet<number>,
  states: Player[],
): Player[] =>
  uniqBy(
    filter(
      filter(states, (state) => state.statuses.isGrounded),
      (state) => !visited.has(hashPlayerNode(state)),
    ),
    (state) => hashPlayerNode(state),
  );
