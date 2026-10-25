import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { HURT_PLAYER_COLORS, PLAYER_COLORS } from '../consts';
import { createPlayerBodyStep } from './create-player-body-step';
import { createPlayerFigureStep } from './create-player-figure-step';
import { createPlayerHeadStep } from './create-player-head-step';
import { createPlayerLegsStep } from './create-player-legs-step';

describe('createPlayerFigureStep', () => {
  it('should draw the legs, then the body, then the head when the player walks on the ground', () => {
    const calls = drawRecorded(
      createPlayerFigureStep(true, false, 3, PLAYER_COLORS),
    );

    expect(calls).toEqual([
      ...drawRecorded(createPlayerLegsStep(true, 3, PLAYER_COLORS)),
      ...drawRecorded(createPlayerBodyStep(3, PLAYER_COLORS)),
      ...drawRecorded(createPlayerHeadStep(false, PLAYER_COLORS)),
    ]);
  });

  it('should draw the airborne legs and the dead eyes when the player is dying in the air', () => {
    const calls = drawRecorded(
      createPlayerFigureStep(false, true, 0, HURT_PLAYER_COLORS),
    );

    expect(calls).toEqual([
      ...drawRecorded(createPlayerLegsStep(false, 0, HURT_PLAYER_COLORS)),
      ...drawRecorded(createPlayerBodyStep(0, HURT_PLAYER_COLORS)),
      ...drawRecorded(createPlayerHeadStep(true, HURT_PLAYER_COLORS)),
    ]);
  });
});
