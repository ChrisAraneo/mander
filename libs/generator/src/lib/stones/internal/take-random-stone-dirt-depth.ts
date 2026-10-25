import { type Random, isRollUnder } from '@mander/engine';
import type { Tile } from '@mander/model';
import { match } from 'ts-pattern';
import { DEEP_DIRT_DEPTH, DIRT_DEPTH } from '../../consts';
import type { StoneDirtDepth } from './types/stone-dirt-depth';

const DEEP_DIRT_CHANCE = 0.5;

export const takeRandomStoneDirtDepth = ({
  tiles,
  random,
}: {
  tiles: Tile[][];
  random: Random;
}): StoneDirtDepth => ({
  tiles,
  depth: match(isRollUnder(DEEP_DIRT_CHANCE, random))
    .with(true, () => DEEP_DIRT_DEPTH)
    .otherwise(() => DIRT_DEPTH),
});
