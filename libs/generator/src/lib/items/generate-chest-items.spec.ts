import {
  BOOTS_OF_CLOUDS,
  BULLET,
  FOUR_BULLETS,
  type Item,
  THREE_BULLETS,
  TITANIUM_HELMET,
  TWO_BULLETS,
  VAMPIRE_SLAYER_BULLET_RAIN,
} from '@mander/model';
import {
  countBy,
  every,
  filter,
  flatMap,
  map,
  mapValues,
  size,
  some,
  sum,
  times,
  uniq,
  values,
} from 'lodash-es';
import { describe, expect, it } from 'vitest';

import {
  type ChestItemType,
  CHEST_ITEM_COUNT,
  CHEST_ITEM_POOL,
  CHEST_ITEM_TYPES,
  chestTypeOf,
  generateChestItems,
  RARITY_CHANCE,
} from './generate-chest-items';

const SEED = 'PROBE-SEED';

const seeds = times(400, (day) => `DAY-${day}`);

const drawn = (): Item[] => flatMap(seeds, generateChestItems);

const idsIn = (seed: string): string[] => map(generateChestItems(seed), 'id');

const typesIn = (seed: string): (ChestItemType | undefined)[] =>
  map(generateChestItems(seed), chestTypeOf);

const isEpicChest = (seed: string): boolean =>
  some(generateChestItems(seed), { rarity: 'EPIC' });

const epicSeeds = (): string[] => filter(seeds, isEpicChest);

const everydaySeeds = (): string[] =>
  filter(seeds, (seed) => !isEpicChest(seed));

const leadCards = (): Item[] =>
  map(seeds, (seed) => generateChestItems(seed)[0]);

describe('generateChestItems', () => {
  it('fills the chest from the same seed the same way', () => {
    expect(generateChestItems(SEED)).toEqual(generateChestItems(SEED));
  });

  it('lays the cards out differently from a different seed', () => {
    const filled = map(seeds, idsIn);

    expect(size(uniq(map(filled, String)))).toBeGreaterThan(1);
  });

  it('offers three cards to choose between when no epic turns up', () => {
    expect(CHEST_ITEM_COUNT).toBe(3);
    expect(
      filter(everydaySeeds(), (seed) => size(generateChestItems(seed)) !== 3),
    ).toEqual([]);
  });

  it('deals each card a type of its own — gem, bullet, heart or star', () => {
    expect(CHEST_ITEM_TYPES).toEqual([
      'GEM',
      'BULLET',
      'HEART',
      'STAR',
      'GEAR',
    ]);
    expect(
      filter(everydaySeeds(), (seed) => size(uniq(typesIn(seed))) !== 3),
      'no chest doubles up on a type',
    ).toEqual([]);
  });

  it('reaches for every type across enough chests', () => {
    expect(uniq(map(drawn(), chestTypeOf)).sort()).toEqual(
      [...CHEST_ITEM_TYPES].sort(),
    );
  });

  it('never offers the same item twice in one chest', () => {
    expect(
      filter(seeds, (seed) => size(uniq(idsIn(seed))) !== size(idsIn(seed))),
    ).toEqual([]);
  });

  it('reaches for every item in the pool sooner or later', () => {
    expect(size(countBy(drawn(), 'id'))).toBe(size(CHEST_ITEM_POOL));
  });

  it('lets a rare card lead the chest less often than a common one', () => {
    const leading = countBy(leadCards(), 'rarity');

    expect(leading['RARE']).toBeLessThan(leading['COMMON']);
  });

  it('promises four commons in five, a rare in five and an epic in a hundred', () => {
    expect(RARITY_CHANCE).toEqual({ COMMON: 0.8, RARE: 0.19, EPIC: 0.01 });
    expect(sum(values(RARITY_CHANCE)), 'and nothing else').toBeCloseTo(1);
  });

  it('deals the cards out at close to those odds', () => {
    const cards = drawn();
    const share = mapValues(
      countBy(cards, 'rarity'),
      (count) => count / size(cards),
    );

    expect(share['COMMON']).toBeCloseTo(RARITY_CHANCE.COMMON, 1);
    expect(share['RARE']).toBeCloseTo(RARITY_CHANCE.RARE, 1);
  });

  it('turns up an epic chest now and then, but only now and then', () => {
    const share = size(epicSeeds()) / size(seeds);

    expect(share, 'epics do happen').toBeGreaterThan(0);
    expect(share, 'and stay rare').toBeLessThan(0.1);
  });

  it('hands the whole chest to an epic, with nothing else to pick', () => {
    for (const seed of epicSeeds()) {
      const cards = generateChestItems(seed);

      expect(every(cards, { rarity: 'EPIC' }), `only epics on ${seed}`).toBe(
        true,
      );
      expect(size(cards), `at least one card on ${seed}`).toBeGreaterThan(0);
      expect(size(uniq(map(cards, 'id'))), `no repeats on ${seed}`).toBe(
        size(cards),
      );
    }
  });

  it('keeps the epics to the bullet rain and the two pieces of gear', () => {
    expect(
      map(filter(CHEST_ITEM_POOL, { rarity: 'EPIC' }), 'id').sort(),
    ).toEqual(
      [
        BOOTS_OF_CLOUDS.id,
        TITANIUM_HELMET.id,
        VAMPIRE_SLAYER_BULLET_RAIN.id,
      ].sort(),
    );
  });

  it('keeps the epics out of the ordinary chests', () => {
    expect(
      filter(everydaySeeds(), (seed) =>
        some(generateChestItems(seed), { rarity: 'EPIC' }),
      ),
    ).toEqual([]);
  });

  it('deals the gear only when an epic takes the chest', () => {
    expect(
      filter(everydaySeeds(), (seed) =>
        some(typesIn(seed), (type) => type === 'GEAR'),
      ),
      'gear never rides along with commons and rares',
    ).toEqual([]);
  });

  it('keeps the bullet cards in the deck', () => {
    expect(map(CHEST_ITEM_POOL, 'id')).toEqual(
      expect.arrayContaining([
        BULLET.id,
        TWO_BULLETS.id,
        THREE_BULLETS.id,
        FOUR_BULLETS.id,
        VAMPIRE_SLAYER_BULLET_RAIN.id,
      ]),
    );
  });

  it('keeps the rare cards worth finding rather than shelving them', () => {
    const withRare = filter(seeds, (seed) =>
      some(generateChestItems(seed), { rarity: 'RARE' }),
    );

    expect(size(withRare) / size(seeds)).toBeGreaterThan(0.1);
  });
});
