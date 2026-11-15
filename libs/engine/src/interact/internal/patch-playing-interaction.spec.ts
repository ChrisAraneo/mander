import { describe, expect, it } from 'vitest';

import { FIRST_LEVEL_INDEX } from '../../load-level/consts';
import { createInitialState } from '../../start/create-initial-state';
import type { GameState } from '../../state/types/game-state';
import { createInteractTestLevel } from '../create-interact-test-level';
import { patchPlayingInteraction } from './patch-playing-interaction';
import { patchPortalInteraction } from './patch-portal-interaction';

const LEVEL = createInteractTestLevel();

const START_SCORE = 500;

const LEVEL_SECONDS = 12.4;

const EARLIER_LEVEL_SECONDS = 30;

const createState = (): GameState => ({
  ...createInitialState(LEVEL, FIRST_LEVEL_INDEX, []),
  score: START_SCORE,
  time: LEVEL_SECONDS,
  levelTimes: [EARLIER_LEVEL_SECONDS],
  isNearPortal: true,
});

describe('patchPlayingInteraction', () => {
  it('should open the chest when the player stands by it holding the key', () => {
    const state: GameState = {
      ...createState(),
      isNearChest: true,
      hasKey: true,
    };

    const interacted = patchPlayingInteraction(state);

    expect(interacted).toEqual({ ...state, status: 'CHEST' });
  });

  it('should try the portal when the player stands by the chest without the key', () => {
    const state: GameState = {
      ...createState(),
      isNearChest: true,
      hasKey: false,
    };

    const interacted = patchPlayingInteraction(state);

    expect(interacted).toEqual(patchPortalInteraction(state));
  });

  it('should try the portal when the player holds the key away from the chest', () => {
    const state: GameState = {
      ...createState(),
      isNearChest: false,
      hasKey: true,
    };

    const interacted = patchPlayingInteraction(state);

    expect(interacted).toEqual(patchPortalInteraction(state));
  });

  it('should leave the game it was handed untouched when the player opens the chest', () => {
    const state: GameState = {
      ...createState(),
      isNearChest: true,
      hasKey: true,
    };
    const before = structuredClone(state);

    patchPlayingInteraction(state);

    expect(state).toEqual(before);
  });
});
