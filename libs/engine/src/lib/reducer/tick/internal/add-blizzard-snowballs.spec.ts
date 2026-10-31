import type { Snowball } from '@mander/model';
import { describe, expect, it } from 'vitest';

import type { Blizzard } from '../../enemy/types/blizzard';
import { SNOWBALL_SPEED } from '../../snowball/consts';
import { addBlizzardSnowballs } from './add-blizzard-snowballs';

const createSnowball = (left: number): Snowball => ({
  position: { x: left, y: 10 },
  velocity: { x: { current: SNOWBALL_SPEED, max: SNOWBALL_SPEED } },
});

const createBlizzard = (snowballs: Snowball[]): Blizzard => ({
  enemies: [],
  snowballs,
});

describe('addBlizzardSnowballs', () => {
  it('should put the newly thrown snowballs after the flying ones when both are there', () => {
    const added = addBlizzardSnowballs(
      [createSnowball(10)],
      createBlizzard([createSnowball(20)]),
    );

    expect(added).toEqual([createSnowball(10), createSnowball(20)]);
  });

  it('should keep the flying snowballs alone when nothing new was thrown', () => {
    const added = addBlizzardSnowballs(
      [createSnowball(10)],
      createBlizzard([]),
    );

    expect(added).toEqual([createSnowball(10)]);
  });

  it('should give only the newly thrown snowballs when none were in the air', () => {
    const added = addBlizzardSnowballs(
      [],
      createBlizzard([createSnowball(20)]),
    );

    expect(added).toEqual([createSnowball(20)]);
  });

  it('should give nothing when no snowball is in the air and none was thrown', () => {
    expect(addBlizzardSnowballs([], createBlizzard([]))).toEqual([]);
  });

  it('should leave the given snowballs alone when it gathers them', () => {
    const flying = [createSnowball(10)];

    addBlizzardSnowballs(flying, createBlizzard([createSnowball(20)]));

    expect(flying).toEqual([createSnowball(10)]);
  });
});
