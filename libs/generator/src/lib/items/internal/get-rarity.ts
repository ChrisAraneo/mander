import type { ItemRarity } from '@mander/model';
import { match, P } from 'ts-pattern';
import { RARITY_CHANCE } from '../../consts';

const { number } = P;

export const getRarity = (roll: number): ItemRarity =>
  match(roll)
    .with(number.lt(RARITY_CHANCE.COMMON), (): ItemRarity => 'COMMON')
    .with(
      number.lt(RARITY_CHANCE.COMMON + RARITY_CHANCE.RARE),
      (): ItemRarity => 'RARE',
    )
    .otherwise((): ItemRarity => 'EPIC');
