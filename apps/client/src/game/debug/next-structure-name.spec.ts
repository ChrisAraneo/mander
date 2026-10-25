import { STRUCTURE_CHOICES } from '@mander/generator';
import { find, findLast, last } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { NEXT_STRUCTURE_OFFSET, PREVIOUS_STRUCTURE_OFFSET } from './consts';
import { nextStructureName } from './next-structure-name';

const FIRST_NAME = STRUCTURE_CHOICES[0].name;

const SECOND_NAME = STRUCTURE_CHOICES[1].name;

const LAST_NAME = last(STRUCTURE_CHOICES)?.name ?? '';

const LAST_NORMAL_NAME =
  findLast(STRUCTURE_CHOICES, (choice) => choice.category === 'NORMAL')?.name ??
  '';

const FIRST_HARD_NAME =
  find(STRUCTURE_CHOICES, (choice) => choice.category === 'HARD')?.name ?? '';

describe('nextStructureName', () => {
  it('should give the following structure when it moves forward', () => {
    expect(nextStructureName(FIRST_NAME, NEXT_STRUCTURE_OFFSET)).toBe(
      SECOND_NAME,
    );
  });

  it('should give the earlier structure when it moves back', () => {
    expect(nextStructureName(SECOND_NAME, PREVIOUS_STRUCTURE_OFFSET)).toBe(
      FIRST_NAME,
    );
  });

  it('should go round to the first structure when it moves forward from the last', () => {
    expect(nextStructureName(LAST_NAME, NEXT_STRUCTURE_OFFSET)).toBe(
      FIRST_NAME,
    );
  });

  it('should go round to the last structure when it moves back from the first', () => {
    expect(nextStructureName(FIRST_NAME, PREVIOUS_STRUCTURE_OFFSET)).toBe(
      LAST_NAME,
    );
  });

  it('should cross from one pool into the next when it reaches the end of a pool', () => {
    expect(nextStructureName(LAST_NORMAL_NAME, NEXT_STRUCTURE_OFFSET)).toBe(
      FIRST_HARD_NAME,
    );
  });
});
