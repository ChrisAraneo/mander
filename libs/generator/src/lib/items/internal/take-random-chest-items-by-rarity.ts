import type { Item } from '@mander/model';
import { isEmpty } from 'lodash-es';
import { match } from 'ts-pattern';
import { EPIC_POOL } from '../../consts';
import { takeRandomEpics } from './take-random-epics';
import { takeRandomEverydayItems } from './take-random-everyday-items';
import type { ChestEpicCount } from './types/chest-epic-count';

export const takeRandomChestItemsByRarity = ({
  rarities,
  epics,
  random,
}: ChestEpicCount): Item[] =>
  match(epics > 0 && !isEmpty(EPIC_POOL))
    .with(true, () => takeRandomEpics(epics, random))
    .otherwise(() => takeRandomEverydayItems(rarities, random));
