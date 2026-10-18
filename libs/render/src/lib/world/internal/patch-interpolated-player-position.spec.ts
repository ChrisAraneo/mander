import type { Player } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createRenderTestState } from '../../../test/create-render-test-state';
import { patchInterpolatedPlayerPosition } from './patch-interpolated-player-position';

const BASE_PLAYER = createRenderTestState(['.@..', '####']).player;

const createTestPlayer = (positionX: number): Player => ({
  ...BASE_PLAYER,
  position: { x: positionX, y: 40 },
});

describe('patchInterpolatedPlayerPosition', () => {
  it('should move the player part of the way when it is given a blend', () => {
    const result = patchInterpolatedPlayerPosition(
      createTestPlayer(100),
      createTestPlayer(110),
      0.5,
    );

    expect(result).toEqual({
      ...createTestPlayer(110),
      position: { x: 105, y: 40 },
    });
  });

  it('should not change the player it was given when it moves the player', () => {
    const previous = createTestPlayer(100);
    const current = createTestPlayer(110);

    patchInterpolatedPlayerPosition(previous, current, 0.5);

    expect(previous).toEqual(createTestPlayer(100));
    expect(current).toEqual(createTestPlayer(110));
  });
});
