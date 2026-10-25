import {
  createStructureWorld,
  createWorld,
  STRUCTURE_CHOICES,
} from '@mander/generator';
import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createRunWorld } from './create-run-world';

const DAY = '2026-01-01';

const CHOICE = STRUCTURE_CHOICES[0];

describe('createRunWorld', () => {
  it('should build the world of the day when no structure is chosen', () => {
    expect(createRunWorld(DAY, null)).toEqual(createWorld(new Date(DAY)));
  }, 120000);

  it('should build a single level from the structure when one is chosen', () => {
    const world = createRunWorld(DAY, CHOICE.name);

    expect(world).toEqual(createStructureWorld(CHOICE));
    expect(size(world.levels)).toBe(1);
  });

  it('should build the world of the day when the chosen structure does not exist', () => {
    expect(createRunWorld(DAY, 'NORMAL_999')).toEqual(
      createWorld(new Date(DAY)),
    );
  }, 120000);
});
