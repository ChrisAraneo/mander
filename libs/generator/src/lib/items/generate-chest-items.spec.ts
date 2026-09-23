import {
  BOOTS_OF_CLOUDS,
  BULLET,
  FOUR_BULLETS,
  type Item,
  MOON_MAGNET,
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
  getChestType,
  generateChestItems,
  RARITY_CHANCE,
} from './generate-chest-items';

const SEED = 'PROBE-SEED';

const seeds = times(400, (day) => `DAY-${day}`);

const drawn = (): Item[] => flatMap(seeds, generateChestItems);

const idsIn = (seed: string): string[] => map(generateChestItems(seed), 'id');

const typesIn = (seed: string): (ChestItemType | undefined)[] =>
  map(generateChestItems(seed), getChestType);

const isEpicChest = (seed: string): boolean =>
  some(generateChestItems(seed), { rarity: 'EPIC' });

const epicSeeds = (): string[] => filter(seeds, isEpicChest);

const everydaySeeds = (): string[] =>
  filter(seeds, (seed) => !isEpicChest(seed));

const leadCards = (): Item[] =>
  map(seeds, (seed) => generateChestItems(seed)[0]);

describe('generateChestItems', () => {
  it('should fill the chest the same way when the seed is the same', () => {
    expect(generateChestItems(SEED)).toEqual(generateChestItems(SEED));
  });

  it('should lay the cards out differently when the seed differs', () => {
    const filled = map(seeds, idsIn);

    expect(size(uniq(map(filled, String)))).toBeGreaterThan(1);
  });

  it('should offer three cards to choose between when no epic turns up', () => {
    expect(CHEST_ITEM_COUNT).toBe(3);
    expect(
      filter(everydaySeeds(), (seed) => size(generateChestItems(seed)) !== 3),
    ).toEqual([]);
  });

  it('should deal each card a type of its own when it fills a chest', () => {
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

  it('should reach for every type when enough chests are filled', () => {
    expect(uniq(map(drawn(), getChestType)).sort()).toEqual(
      [...CHEST_ITEM_TYPES].sort(),
    );
  });

  it('should never offer the same item twice when it fills one chest', () => {
    expect(
      filter(seeds, (seed) => size(uniq(idsIn(seed))) !== size(idsIn(seed))),
    ).toEqual([]);
  });

  it('should reach for every item in the pool when enough chests are filled', () => {
    expect(size(countBy(drawn(), 'id'))).toBe(size(CHEST_ITEM_POOL));
  });

  it('should lead the chest less often than a common one when the card is rare', () => {
    const leading = countBy(leadCards(), 'rarity');

    expect(leading['RARE']).toBeLessThan(leading['COMMON']);
  });

  it('should promise four commons in five, a rare in five and an epic in fifty when it deals the odds', () => {
    expect(RARITY_CHANCE).toEqual({ COMMON: 0.79, RARE: 0.19, EPIC: 0.02 });
    expect(sum(values(RARITY_CHANCE)), 'and nothing else').toBeCloseTo(1);
  });

  it('should deal the cards out close to those odds when enough chests are filled', () => {
    const cards = drawn();
    const share = mapValues(
      countBy(cards, 'rarity'),
      (count) => count / size(cards),
    );

    expect(share['COMMON']).toBeCloseTo(RARITY_CHANCE.COMMON, 1);
    expect(share['RARE']).toBeCloseTo(RARITY_CHANCE.RARE, 1);
  });

  it('should turn up now and then but stay rare when the chest is an epic one', () => {
    const share = size(epicSeeds()) / size(seeds);

    expect(share, 'epics do happen').toBeGreaterThan(0);
    expect(share, 'and stay rare').toBeLessThan(0.1);
  });

  it('should hand the whole chest over with nothing else to pick when an epic takes it', () => {
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

  it('should keep the epics to the bullet rain and the three pieces of gear when it stocks the pool', () => {
    expect(
      map(filter(CHEST_ITEM_POOL, { rarity: 'EPIC' }), 'id').sort(),
    ).toEqual(
      [
        BOOTS_OF_CLOUDS.id,
        MOON_MAGNET.id,
        TITANIUM_HELMET.id,
        VAMPIRE_SLAYER_BULLET_RAIN.id,
      ].sort(),
    );
  });

  it('should keep the epics out when the chest is an ordinary one', () => {
    expect(
      filter(everydaySeeds(), (seed) =>
        some(generateChestItems(seed), { rarity: 'EPIC' }),
      ),
    ).toEqual([]);
  });

  it('should deal the gear only when an epic takes the chest', () => {
    expect(
      filter(everydaySeeds(), (seed) =>
        some(typesIn(seed), (type) => type === 'GEAR'),
      ),
      'gear never rides along with commons and rares',
    ).toEqual([]);
  });

  it('should keep the bullet cards in when it stocks the deck', () => {
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

  it('should offer a rare card often enough to be worth finding when enough chests are filled', () => {
    const withRare = filter(seeds, (seed) =>
      some(generateChestItems(seed), { rarity: 'RARE' }),
    );

    expect(size(withRare) / size(seeds)).toBeGreaterThan(0.1);
  });
});
