import type { Player } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createStandingPlayer } from './create-standing-player';
import { filterLandings } from './filter-landings';
import { hashPlayerNode } from './hash-player-node';

const createAirbornePlayer = (left: number, top: number): Player => ({
  ...createStandingPlayer(left, top),
  statuses: { ...createStandingPlayer(left, top).statuses, isGrounded: false },
});

const FAR_LANDING = createStandingPlayer(64, 0);

const NEAR_LANDING = createStandingPlayer(0, 0);

const NEAR_LANDING_NUDGED = createStandingPlayer(5, 0);

const VISITED_LANDING = createStandingPlayer(96, 0);

const MID_AIR = createAirbornePlayer(128, 0);

describe('filterLandings', () => {
  it('should keep the first new landing on each spot in order when the player lands on new and visited spots and is in the air', () => {
    const visited = new Set([hashPlayerNode(VISITED_LANDING)]);

    const landings = filterLandings(visited, [
      FAR_LANDING,
      MID_AIR,
      NEAR_LANDING,
      NEAR_LANDING_NUDGED,
      VISITED_LANDING,
    ]);

    expect(landings).toEqual([FAR_LANDING, NEAR_LANDING]);
    expect(landings[1]).toBe(NEAR_LANDING);
  });

  it('should keep nothing when the player has no states', () => {
    const visited = new Set<number>();

    const landings = filterLandings(visited, []);

    expect(landings).toEqual([]);
  });
});
