import { createRandom } from '@mander/engine';
import { describe, expect, it } from 'vitest';

import { createPalette } from '../palette/create-palette';
import { createWorldPalette } from './create-world-palette';

describe('createWorldPalette', () => {
  it('should paint the world from the generator when it starts a world', () => {
    expect(
      createWorldPalette({ name: 'WORLD', random: createRandom('DAY-1') })
        .palette,
    ).toEqual(createPalette(createRandom('DAY-1')));
  });

  it('should paint the world the same way when the generator starts from the same seed', () => {
    expect(
      createWorldPalette({ name: 'WORLD', random: createRandom('DAY-1') })
        .palette,
    ).toEqual(
      createWorldPalette({ name: 'WORLD', random: createRandom('DAY-1') })
        .palette,
    );
  });

  it('should paint the world another way when the generator starts from another seed', () => {
    expect(
      createWorldPalette({ name: 'WORLD', random: createRandom('DAY-1') })
        .palette,
    ).not.toEqual(
      createWorldPalette({ name: 'WORLD', random: createRandom('DAY-2') })
        .palette,
    );
  });

  it('should pass the name on when it paints the world', () => {
    expect(
      createWorldPalette({ name: 'WORLD', random: createRandom('DAY-1') }).name,
    ).toBe('WORLD');
  });

  it('should pass the generator on when it paints the world', () => {
    const random = createRandom('DAY-1');

    expect(createWorldPalette({ name: 'WORLD', random }).random).toBe(random);
  });
});
