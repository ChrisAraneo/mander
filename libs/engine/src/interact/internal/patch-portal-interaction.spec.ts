import { describe, expect, it } from 'vitest';

import { FIRST_LEVEL_INDEX } from '../../load-level/consts';
import { LEVEL_SCORE_BASE, LEVEL_SCORE_PER_SECOND } from '../../score/consts';
import { createInitialState } from '../../start/create-initial-state';
import type { GameState } from '../../state/types/game-state';
import { createInteractTestLevel } from '../create-interact-test-level';
import { patchPortalInteraction } from './patch-portal-interaction';

const LEVEL = createInteractTestLevel();

const START_SCORE = 500;

const LEVEL_SECONDS = 12.4;

const ROUNDED_SECONDS = 12;

const LEVEL_SCORE = LEVEL_SCORE_BASE - LEVEL_SCORE_PER_SECOND * ROUNDED_SECONDS;

const EARLIER_LEVEL_SECONDS = 30;

const createState = (): GameState => ({
  ...createInitialState(LEVEL, FIRST_LEVEL_INDEX, []),
  score: START_SCORE,
  time: LEVEL_SECONDS,
  levelTimes: [EARLIER_LEVEL_SECONDS],
});

describe('patchPortalInteraction', () => {
  it('should finish the level when the player stands by the portal', () => {
    const state: GameState = { ...createState(), isNearPortal: true };

    const interacted = patchPortalInteraction(state);

    expect(interacted.status).toBe('COMPLETE');
    expect(interacted.score).toBe(START_SCORE + LEVEL_SCORE);
    expect(interacted.levelTimes).toEqual([
      EARLIER_LEVEL_SECONDS,
      LEVEL_SECONDS,
    ]);
  });

  it('should change nothing when the player is away from the portal', () => {
    const state = createState();

    const interacted = patchPortalInteraction(state);

    expect(interacted).toBe(state);
  });

  it('should leave the game it was handed untouched when the player finishes the level', () => {
    const state: GameState = { ...createState(), isNearPortal: true };
    const before = structuredClone(state);

    patchPortalInteraction(state);

    expect(state).toEqual(before);
  });
});
