import { isEmpty } from 'lodash-es';
import { match } from 'ts-pattern';
import { EPIC_POOL } from '../../consts';
import type { countChestEpics } from './count-chest-epics';
import { takeRandomEpics } from './take-random-epics';
import { takeRandomEverydayItems } from './take-random-everyday-items';

export const takeRandomChestItemsByRarity = ({
  rarities,
  epics,
  random,
}: ReturnType<typeof countChestEpics>) =>
  match(epics > 0 && !isEmpty(EPIC_POOL))
    .with(true, () => takeRandomEpics(epics, random))
    .otherwise(() => takeRandomEverydayItems(rarities, random));
