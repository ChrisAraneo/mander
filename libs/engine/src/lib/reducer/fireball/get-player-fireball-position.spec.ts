import type { Fireball } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { PLAYER_FIREBALL_ORBIT_RADIUS } from './consts';
import { getFireballPosition } from './get-fireball-position';
import { getPlayerFireballPosition } from './get-player-fireball-position';

const FIREBALL: Fireball = {
  spin: 'CLOCKWISE',
  origin: { x: 100, y: 50 },
  angle: 1,
};

describe('getPlayerFireballPosition', () => {
  it('should place the fireball on the player orbit when it circles the player', () => {
    const position = getPlayerFireballPosition(FIREBALL);

    expect(position).toEqual(
      getFireballPosition(FIREBALL, PLAYER_FIREBALL_ORBIT_RADIUS),
    );
  });

  it('should place the fireball to the right of the player when the angle is zero', () => {
    const position = getPlayerFireballPosition({ ...FIREBALL, angle: 0 });

    expect(position.x).toBeCloseTo(100 + PLAYER_FIREBALL_ORBIT_RADIUS, 6);
    expect(position.y).toBeCloseTo(50, 6);
  });
});
