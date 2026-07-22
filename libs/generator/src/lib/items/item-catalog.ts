import type { CatalogEntry } from './catalog-entry';
import { entry } from './entry';

export const ITEM_CATALOG: readonly CatalogEntry[] = [
  entry(
    {
      id: 'ember-charm',
      name: 'Ember Charm',
      description: 'A warm little coal on a string. It hums quietly.',
      rarity: 'common',
      effect: { kind: 'none' },
    },
    26
  ),
  entry(
    {
      id: 'river-pearl',
      name: 'River Pearl',
      description: 'Smooth and cool. Salamanders consider these lucky.',
      rarity: 'common',
      effect: { kind: 'none' },
    },
    26
  ),
  entry(
    {
      id: 'moss-cloak',
      name: 'Moss Cloak',
      description: 'Smells like rain. Very cozy.',
      rarity: 'common',
      effect: { kind: 'none' },
    },
    26
  ),
  entry(
    {
      id: 'glow-lantern',
      name: 'Glow Lantern',
      description: 'A jar of patient fireflies lighting the way.',
      rarity: 'common',
      effect: { kind: 'none' },
    },
    26
  ),
  entry(
    {
      id: 'stone-idol',
      name: 'Stone Idol',
      description: 'A tiny carving of an ancient mander. It judges you kindly.',
      rarity: 'common',
      effect: { kind: 'none' },
    },
    26
  ),
  entry(
    {
      id: 'beetle-snack',
      name: 'Dried Beetle Snack',
      description: 'Crunchy. Best saved for a long journey.',
      rarity: 'common',
      effect: { kind: 'none' },
    },
    26
  ),
  entry(
    {
      id: 'map-fragment',
      name: 'Old Map Fragment',
      description: 'A corner of a map showing somewhere you have not been yet.',
      rarity: 'common',
      effect: { kind: 'none' },
    },
    26
  ),
  entry(
    {
      id: 'trail-boots',
      name: 'Worn Trail Boots',
      description: 'Broken in by someone in a hurry. +3% movement speed.',
      rarity: 'common',
      effect: { kind: 'speed', percent: 3 },
    },
    22
  ),
  entry(
    {
      id: 'river-skimmers',
      name: 'River Skimmers',
      description: 'Light shoes that barely touch the ground. +5% movement speed.',
      rarity: 'rare',
      effect: { kind: 'speed', percent: 5 },
    },
    14
  ),
  entry(
    {
      id: 'zephyr-moccasins',
      name: 'Zephyr Moccasins',
      description: 'Stitched from a caught breeze. +7% movement speed.',
      rarity: 'epic',
      effect: { kind: 'speed', percent: 7 },
    },
    8
  ),
];
