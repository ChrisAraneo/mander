import { type Fireball, MAX_TICK_SECONDS } from '@mander/model';
import { head, last, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { PLAYER_FIREBALL_ANGULAR_SPEED } from '../consts';
import { getPlayerFireballPosition } from '../get-player-fireball-position';
import { computeSweptCentres } from './compute-swept-centres';
import { computeSweptStepCount } from './compute-swept-step-count';

const FIREBALL: Fireball = {
  spin: 'CLOCKWISE',
  origin: { x: 200, y: 200 },
  angle: 1,
};

const SWEPT_ANGLE = PLAYER_FIREBALL_ANGULAR_SPEED * MAX_TICK_SECONDS;

describe('computeSweptCentres', () => {
  it('should give one centre more than the sweep has steps when the fireball moves for a whole tick', () => {
    const centres = computeSweptCentres(FIREBALL, MAX_TICK_SECONDS);

    expect(size(centres)).toBe(computeSweptStepCount(SWEPT_ANGLE) + 1);
    expect(size(centres)).toBe(5);
  });

  it('should start at the current position of the fireball when the fireball moves for a whole tick', () => {
    const centres = computeSweptCentres(FIREBALL, MAX_TICK_SECONDS);

    expect(head(centres)).toEqual(getPlayerFireballPosition(FIREBALL));
  });

  it('should walk back against the spin when the fireball spins clockwise', () => {
    const expected = getPlayerFireballPosition({
      ...FIREBALL,
      angle: FIREBALL.angle - SWEPT_ANGLE,
    });

    const centres = computeSweptCentres(FIREBALL, MAX_TICK_SECONDS);

    expect(last(centres)?.x).toBeCloseTo(expected.x, 6);
    expect(last(centres)?.y).toBeCloseTo(expected.y, 6);
  });

  it('should walk back against the spin when the fireball spins anticlockwise', () => {
    const fireball: Fireball = { ...FIREBALL, spin: 'ANTICLOCKWISE' };
    const expected = getPlayerFireballPosition({
      ...fireball,
      angle: fireball.angle + SWEPT_ANGLE,
    });

    const centres = computeSweptCentres(fireball, MAX_TICK_SECONDS);

    expect(head(centres)).toEqual(getPlayerFireballPosition(fireball));
    expect(last(centres)?.x).toBeCloseTo(expected.x, 6);
    expect(last(centres)?.y).toBeCloseTo(expected.y, 6);
  });

  it('should sweep no further than one tick when more time has passed', () => {
    const centres = computeSweptCentres(FIREBALL, 1);

    expect(centres).toEqual(computeSweptCentres(FIREBALL, MAX_TICK_SECONDS));
  });

  it('should give two centres at the current position when no time has passed', () => {
    const centres = computeSweptCentres(FIREBALL, 0);

    expect(centres).toEqual([
      getPlayerFireballPosition(FIREBALL),
      getPlayerFireballPosition(FIREBALL),
    ]);
  });
});
