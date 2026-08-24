import {
  BLUE_GEM,
  BOOTS_OF_CLOUDS,
  BULLET,
  DOUBLE_HEART,
  DOUBLE_STAR,
  FOUR_BULLETS,
  GREEN_GEM,
  HEART,
  type Item,
  type ItemRarity,
  MOON_MAGNET,
  PINK_GEM,
  PURPLE_GEM,
  RED_GEM,
  STAR,
  THREE_BULLETS,
  TITANIUM_HELMET,
  TRIPLE_HEART,
  TRIPLE_STAR,
  TWO_BULLETS,
  VAMPIRE_SLAYER_BULLET_RAIN,
  YELLOW_GEM,
} from '@mander/model';
import { createRandom } from '@mander/utils';
import {
  concat,
  filter,
  find,
  flatMap,
  includes,
  isEmpty,
  mapValues,
  reduce,
  reject,
  size,
  some,
  times,
  without,
} from 'lodash-es';
import { match } from 'ts-pattern';

export type ChestItemType = 'GEM' | 'BULLET' | 'HEART' | 'STAR' | 'GEAR';

export const CHEST_ITEM_COUNT = 3;

export const CHEST_ITEM_TYPES: readonly ChestItemType[] = Object.freeze([
  'GEM',
  'BULLET',
  'HEART',
  'STAR',
  'GEAR',
]);

const POOL_BY_TYPE: Readonly<Record<ChestItemType, Item[]>> = Object.freeze({
  GEM: [RED_GEM, GREEN_GEM, YELLOW_GEM, BLUE_GEM, PURPLE_GEM, PINK_GEM],
  BULLET: [
    BULLET,
    TWO_BULLETS,
    THREE_BULLETS,
    FOUR_BULLETS,
    VAMPIRE_SLAYER_BULLET_RAIN,
  ],
  HEART: [HEART, DOUBLE_HEART, TRIPLE_HEART],
  STAR: [STAR, DOUBLE_STAR, TRIPLE_STAR],
  GEAR: [BOOTS_OF_CLOUDS, TITANIUM_HELMET, MOON_MAGNET],
});

export const CHEST_ITEM_POOL: readonly Item[] = Object.freeze(
  flatMap(CHEST_ITEM_TYPES, (type) => POOL_BY_TYPE[type]),
);

export const RARITY_CHANCE: Readonly<Record<ItemRarity, number>> =
  Object.freeze({
    COMMON: 0.79,
    RARE: 0.19,
    EPIC: 0.02,
  });

export const chestTypeOf = (item: Item): ChestItemType | undefined =>
  find(CHEST_ITEM_TYPES, (type) => some(POOL_BY_TYPE[type], { id: item.id }));

const EPIC_POOL: readonly Item[] = Object.freeze(
  filter(CHEST_ITEM_POOL, { rarity: 'EPIC' }),
);

const EVERYDAY_BY_TYPE: Readonly<Record<ChestItemType, Item[]>> = Object.freeze(
  mapValues(POOL_BY_TYPE, (items) => reject(items, { rarity: 'EPIC' })),
);

const EVERYDAY_TYPES: readonly ChestItemType[] = Object.freeze(
  filter(CHEST_ITEM_TYPES, (type) => !isEmpty(EVERYDAY_BY_TYPE[type])),
);

type Random = ReturnType<typeof createRandom>;

interface Deal {
  picked: Item[];
  typesLeft: ChestItemType[];
}

const seedFor = (seed: string): string => `${seed}#chest`;

const rarityFor = (roll: number): ItemRarity =>
  match(roll)
    .when(
      (value) => value < RARITY_CHANCE.COMMON,
      (): ItemRarity => 'COMMON',
    )
    .when(
      (value) => value < RARITY_CHANCE.COMMON + RARITY_CHANCE.RARE,
      (): ItemRarity => 'RARE',
    )
    .otherwise((): ItemRarity => 'EPIC');

const rollRarities = (random: Random): ItemRarity[] =>
  times(CHEST_ITEM_COUNT, () => rarityFor(random.next()));

const epicsAmong = (rarities: ItemRarity[]): number =>
  size(filter(rarities, (rarity) => rarity === 'EPIC'));

const candidatesIn = (items: Item[], rarity: ItemRarity): Item[] =>
  match(filter(items, { rarity }))
    .when(isEmpty, () => items)
    .otherwise((matching) => matching);

const takeType = (
  deal: Deal,
  type: ChestItemType,
  rarity: ItemRarity,
  random: Random,
): Deal => ({
  picked: concat(
    deal.picked,
    random.pick(candidatesIn(EVERYDAY_BY_TYPE[type], rarity)),
  ),
  typesLeft: without(deal.typesLeft, type),
});

const typesHolding = (
  typesLeft: ChestItemType[],
  rarity: ItemRarity,
): ChestItemType[] =>
  match(filter(typesLeft, (type) => some(EVERYDAY_BY_TYPE[type], { rarity })))
    .when(isEmpty, () => typesLeft)
    .otherwise((holding) => holding);

const dealCard = (deal: Deal, rarity: ItemRarity, random: Random): Deal =>
  takeType(
    deal,
    random.pick(typesHolding(deal.typesLeft, rarity)),
    rarity,
    random,
  );

const dealChest = (rarities: ItemRarity[], random: Random): Item[] =>
  reduce(
    rarities,
    (deal: Deal, rarity): Deal => dealCard(deal, rarity, random),
    { picked: [], typesLeft: concat([], EVERYDAY_TYPES) },
  ).picked;

const dealEpics = (rolled: number, random: Random): Item[] =>
  reduce(
    times(Math.min(rolled, size(EPIC_POOL))),
    (picked: Item[]): Item[] =>
      concat(
        picked,
        random.pick(reject(EPIC_POOL, (item) => includes(picked, item))),
      ),
    [],
  );

export const generateChestItems = (seed: string): Item[] => {
  const random = createRandom(seedFor(seed));
  const rarities = rollRarities(random);

  return match(epicsAmong(rarities))
    .when(
      (epics) => epics > 0 && !isEmpty(EPIC_POOL),
      (epics) => dealEpics(epics, random),
    )
    .otherwise(() => dealChest(rarities, random));
};
