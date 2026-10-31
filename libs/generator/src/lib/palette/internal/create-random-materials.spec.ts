import { createRandom } from '@mander/engine';
import type { Season } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createRandomBrick } from './create-random-brick';
import { createRandomMaterials } from './create-random-materials';

const SPRING: Season = 'SPRING';

const AUTUMN: Season = 'AUTUMN';

const WINTER: Season = 'WINTER';

describe('createRandomMaterials', () => {
  it('should pick the brick, the wood and the ceramic when it picks the materials', () => {
    const materials = createRandomMaterials(SPRING, createRandom('DAY-1'));

    expect(materials.brick).toEqual(
      createRandomBrick(SPRING, createRandom('DAY-1')),
    );
    expect(materials.wood).not.toEqual(materials.brick);
    expect(materials.ceramic).not.toEqual(materials.wood);
  });

  it('should pick the same materials when the generator starts from the same seed', () => {
    expect(createRandomMaterials(SPRING, createRandom('DAY-1'))).toEqual(
      createRandomMaterials(SPRING, createRandom('DAY-1')),
    );
  });

  it('should pick other materials when the generator starts from another seed', () => {
    expect(createRandomMaterials(SPRING, createRandom('DAY-1'))).not.toEqual(
      createRandomMaterials(SPRING, createRandom('DAY-2')),
    );
  });

  it('should pick other materials when the season turns', () => {
    expect(createRandomMaterials(SPRING, createRandom('DAY-1'))).not.toEqual(
      createRandomMaterials(AUTUMN, createRandom('DAY-1')),
    );
    expect(createRandomMaterials(AUTUMN, createRandom('DAY-1'))).not.toEqual(
      createRandomMaterials(WINTER, createRandom('DAY-1')),
    );
  });
});
