import {
  TILE_BEARTRAP,
  TILE_CANNON,
  TILE_FIREBALL,
  TILE_PORTAL,
  TILE_SPAWN,
  TILE_SPIKE,
  type Tile,
} from '@mander/model';
import { getFront } from '@mander/structures';
import { every, filter, find, flatten, map, size } from 'lodash-es';
import { pipe } from 'remeda';
import { describe, expect, it } from 'vitest';

import { STRUCTURE_WORLD_REPEATS } from './consts';
import { createStructureWorld } from './create-structure-world';
import { STRUCTURE_CHOICES } from './structure-choices';
import type { StructureChoice } from './types/structure-choice';
import type { LevelCategory } from './world/types/level-category';

const HAZARDS: readonly Tile[] = [
  TILE_CANNON,
  TILE_FIREBALL,
  TILE_BEARTRAP,
  TILE_SPIKE,
];

const countTiles = (rows: readonly (readonly Tile[])[], tile: Tile): number =>
  size(filter(flatten(rows), (cell) => cell === tile));

const filterChoices = (category: LevelCategory): StructureChoice[] =>
  filter(STRUCTURE_CHOICES, (choice) => choice.category === category);

const getLevelTiles = (choice: StructureChoice): Tile[][] =>
  createStructureWorld(choice).levels[0].tiles;

const hasSpawnAndPortal = (choice: StructureChoice): boolean =>
  pipe(
    choice,
    getLevelTiles,
    (tiles) =>
      countTiles(tiles, TILE_SPAWN) > 0 && countTiles(tiles, TILE_PORTAL) > 0,
  );

const hasAllHazardsKept = (choice: StructureChoice): boolean =>
  pipe(choice, getLevelTiles, (tiles) =>
    every(
      HAZARDS,
      (hazard) =>
        countTiles(tiles, hazard) >=
        STRUCTURE_WORLD_REPEATS *
          countTiles(getFront(choice.structure), hazard),
    ),
  );

const findChoiceWithoutEnds = (category: LevelCategory): string | undefined =>
  find(filterChoices(category), (choice) => !hasSpawnAndPortal(choice))?.name;

describe('createStructureWorld', () => {
  it('should build the level from the structure three times when it is given one', () => {
    const choice = filterChoices('NORMAL')[0];

    expect(createStructureWorld(choice).levels[0].meta?.structures).toEqual([
      choice.name,
      choice.name,
      choice.name,
    ]);
  });

  it('should build a world of one level named after the structure when it is given one', () => {
    const choice = filterChoices('NORMAL')[0];

    const world = createStructureWorld(choice);

    expect(world.name).toBe(choice.name);
    expect(size(world.levels)).toBe(1);
    expect(world.score).toBe(0);
  });

  it('should give a spawn and a portal to every normal structure when it builds its level', () => {
    expect(findChoiceWithoutEnds('NORMAL')).toBeUndefined();
  }, 120000);

  it('should give a spawn and a portal to every hard structure when it builds its level', () => {
    expect(findChoiceWithoutEnds('HARD')).toBeUndefined();
  }, 120000);

  it('should give a spawn and a portal to every vertical structure when it builds its level', () => {
    expect(findChoiceWithoutEnds('VERTICAL')).toBeUndefined();
  }, 120000);

  it('should remove none of the cannons, fireballs, beartraps and spikes of the structure when it builds the level', () => {
    expect(
      map(
        filter(STRUCTURE_CHOICES, (choice) => !hasAllHazardsKept(choice)),
        (choice) => choice.name,
      ),
    ).toEqual([]);
  }, 120000);

  it('should build the same level when it is given the same structure twice', () => {
    const choice = filterChoices('HARD')[0];

    expect(createStructureWorld(choice)).toEqual(createStructureWorld(choice));
  });

  it('should build another level when it is given another structure', () => {
    const [first, second] = filterChoices('NORMAL');

    expect(getLevelTiles(first)).not.toEqual(getLevelTiles(second));
  });
});
