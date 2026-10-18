import type { ItemRarity } from '@mander/model';
import { match, P } from 'ts-pattern';
import { RARITY_CHANCE } from '../../consts';

const { number } = P;

export const toRarity = (roll: number): ItemRarity =>
  match(roll)
    .with(number.lt(RARITY_CHANCE.COMMON), (): ItemRarity => 'COMMON')
    .otherwise((): ItemRarity => 'RARE');
