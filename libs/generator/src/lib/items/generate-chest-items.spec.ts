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
import { createRandom } from '@mander/utils';
import {
  countBy,
  every,
  filter,
  flatMap,
  map,
  mapValues,
  size,
  some,
  sortBy,
  sum,
  times,
  uniq,
  values,
} from 'lodash-es';
import { describe, expect, it } from 'vitest';

import {
  CHEST_ITEM_COUNT,
  CHEST_ITEM_POOL,
  CHEST_ITEM_TYPES,
  RARITY_CHANCE,
} from '../consts';
import { generateChestItems } from './generate-chest-items';
import { getChestType } from './internal/get-chest-type';
import type { ChestItemType } from './types/chest-item-type';

const SEED = 'PROBE-SEED';

const SEEDS = times(400, (day) => `DAY-${day}`);

const pickRandomFrom = (seed: string): Item[] =>
  generateChestItems(createRandom(seed));

const pickRandomCards = (): Item[] => flatMap(SEEDS, pickRandomFrom);

const getCardIds = (seed: string): string[] => map(pickRandomFrom(seed), 'id');

const getCardTypes = (seed: string): (ChestItemType | undefined)[] =>
  map(pickRandomFrom(seed), getChestType);

const isEpicChest = (seed: string): boolean =>
  some(pickRandomFrom(seed), { rarity: 'EPIC' });

const findEpicSeeds = (): string[] => filter(SEEDS, isEpicChest);

const findEverydaySeeds = (): string[] =>
  filter(SEEDS, (seed) => !isEpicChest(seed));

const getLeadCards = (): Item[] =>
  map(SEEDS, (seed) => pickRandomFrom(seed)[0]);

describe('generateChestItems', () => {
  it('should fill the chest the same way when the generator starts from the same seed', () => {
    expect(pickRandomFrom(SEED)).toEqual(pickRandomFrom(SEED));
  });

  it('should lay the cards out differently when the generator starts from other seeds', () => {
    const filled = map(SEEDS, getCardIds);

    expect(size(uniq(map(filled, String)))).toBeGreaterThan(1);
  });

  it('should offer three cards to choose between when no epic turns up', () => {
    expect(CHEST_ITEM_COUNT).toBe(3);
    expect(
      filter(findEverydaySeeds(), (seed) => size(pickRandomFrom(seed)) !== 3),
    ).toEqual([]);
  });

  it('should pick a type of its own for each card when it fills a chest', () => {
    expect(CHEST_ITEM_TYPES).toEqual([
      'GEM',
      'BULLET',
      'HEART',
      'STAR',
      'GEAR',
    ]);
    expect(
      filter(
        findEverydaySeeds(),
        (seed) => size(uniq(getCardTypes(seed))) !== 3,
      ),
      'no chest doubles up on a type',
    ).toEqual([]);
  });

  it('should reach for every type when enough chests are filled', () => {
    expect(sortBy(uniq(map(pickRandomCards(), getChestType)))).toEqual(
      sortBy(CHEST_ITEM_TYPES),
    );
  });

  it('should never offer the same item twice when it fills one chest', () => {
    expect(
      filter(
        SEEDS,
        (seed) => size(uniq(getCardIds(seed))) !== size(getCardIds(seed)),
      ),
    ).toEqual([]);
  });

  it('should reach for every item in the pool when enough chests are filled', () => {
    expect(size(countBy(pickRandomCards(), 'id'))).toBe(size(CHEST_ITEM_POOL));
  });

  it('should lead the chest less often than a common one when the card is rare', () => {
    const leading = countBy(getLeadCards(), 'rarity');

    expect(leading['RARE']).toBeLessThan(leading['COMMON']);
  });

  it('should promise four commons in five, a rare in five and an epic in fifty when it rolls the rarities', () => {
    expect(RARITY_CHANCE).toEqual({ COMMON: 0.79, RARE: 0.19, EPIC: 0.02 });
    expect(sum(values(RARITY_CHANCE)), 'and nothing else').toBeCloseTo(1);
  });

  it('should pick the cards close to those odds when enough chests are filled', () => {
    const cards = pickRandomCards();

    const share = mapValues(
      countBy(cards, 'rarity'),
      (count) => count / size(cards),
    );

    expect(share['COMMON']).toBeCloseTo(RARITY_CHANCE.COMMON, 1);
    expect(share['RARE']).toBeCloseTo(RARITY_CHANCE.RARE, 1);
  });

  it('should turn up now and then but stay rare when the chest is an epic one', () => {
    const share = size(findEpicSeeds()) / size(SEEDS);

    expect(share, 'epics do happen').toBeGreaterThan(0);
    expect(share, 'and stay rare').toBeLessThan(0.1);
  });

  it('should hand the whole chest over with nothing else to pick when an epic takes it', () => {
    const epicSeeds = findEpicSeeds();

    times(size(epicSeeds), (index) => {
      const seed = epicSeeds[index];
      const cards = pickRandomFrom(seed);

      expect(every(cards, { rarity: 'EPIC' }), `only epics on ${seed}`).toBe(
        true,
      );
      expect(size(cards), `at least one card on ${seed}`).toBeGreaterThan(0);
      expect(size(uniq(map(cards, 'id'))), `no repeats on ${seed}`).toBe(
        size(cards),
      );
    });
  });

  it('should keep the epics to the bullet rain and the three pieces of gear when it stocks the pool', () => {
    expect(
      sortBy(map(filter(CHEST_ITEM_POOL, { rarity: 'EPIC' }), 'id')),
    ).toEqual(
      sortBy([
        BOOTS_OF_CLOUDS.id,
        MOON_MAGNET.id,
        TITANIUM_HELMET.id,
        VAMPIRE_SLAYER_BULLET_RAIN.id,
      ]),
    );
  });

  it('should keep the epics out when the chest is an ordinary one', () => {
    expect(
      filter(findEverydaySeeds(), (seed) =>
        some(pickRandomFrom(seed), { rarity: 'EPIC' }),
      ),
    ).toEqual([]);
  });

  it('should pick the gear only when an epic takes the chest', () => {
    expect(
      filter(findEverydaySeeds(), (seed) =>
        some(getCardTypes(seed), (type) => type === 'GEAR'),
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
    const withRare = filter(SEEDS, (seed) =>
      some(pickRandomFrom(seed), { rarity: 'RARE' }),
    );

    expect(size(withRare) / size(SEEDS)).toBeGreaterThan(0.1);
  });
});
