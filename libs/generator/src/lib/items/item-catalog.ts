import type { CatalogEntry } from './catalog-entry';
import { entry } from './entry';

export const ITEM_CATALOG: readonly CatalogEntry[] = [
  entry(
    {
      id: 'EMBER-CHARM',
      name: 'Ember Charm',
      description: 'A warm little coal on a string. It hums quietly.',
      rarity: 'COMMON',
      effect: { kind: 'NONE' },
    },
    26,
  ),
  entry(
    {
      id: 'RIVER-PEARL',
      name: 'River Pearl',
      description: 'Smooth and cool. Salamanders consider these lucky.',
      rarity: 'COMMON',
      effect: { kind: 'NONE' },
    },
    26,
  ),
  entry(
    {
      id: 'MOSS-CLOAK',
      name: 'Moss Cloak',
      description: 'Smells like rain. Very cozy.',
      rarity: 'COMMON',
      effect: { kind: 'NONE' },
    },
    26,
  ),
  entry(
    {
      id: 'GLOW-LANTERN',
      name: 'Glow Lantern',
      description: 'A jar of patient fireflies lighting the way.',
      rarity: 'COMMON',
      effect: { kind: 'NONE' },
    },
    26,
  ),
  entry(
    {
      id: 'STONE-IDOL',
      name: 'Stone Idol',
      description: 'A tiny carving of an ancient mander. It judges you kindly.',
      rarity: 'COMMON',
      effect: { kind: 'NONE' },
    },
    26,
  ),
  entry(
    {
      id: 'BEETLE-SNACK',
      name: 'Dried Beetle Snack',
      description: 'Crunchy. Best saved for a long journey.',
      rarity: 'COMMON',
      effect: { kind: 'NONE' },
    },
    26,
  ),
  entry(
    {
      id: 'MAP-FRAGMENT',
      name: 'Old Map Fragment',
      description: 'A corner of a map showing somewhere you have not been yet.',
      rarity: 'COMMON',
      effect: { kind: 'NONE' },
    },
    26,
  ),
  entry(
    {
      id: 'TRAIL-BOOTS',
      name: 'Worn Trail Boots',
      description: 'Broken in by someone in a hurry. +3% movement speed.',
      rarity: 'COMMON',
      effect: { kind: 'SPEED', percent: 3 },
    },
    22,
  ),
  entry(
    {
      id: 'RIVER-SKIMMERS',
      name: 'River Skimmers',
      description:
        'Light shoes that barely touch the ground. +5% movement speed.',
      rarity: 'RARE',
      effect: { kind: 'SPEED', percent: 5 },
    },
    14,
  ),
  entry(
    {
      id: 'ZEPHYR-MOCCASINS',
      name: 'Zephyr Moccasins',
      description: 'Stitched from a caught breeze. +7% movement speed.',
      rarity: 'EPIC',
      effect: { kind: 'SPEED', percent: 7 },
    },
    8,
  ),
];
