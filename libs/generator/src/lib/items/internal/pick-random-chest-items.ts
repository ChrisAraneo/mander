import { isEmpty } from 'lodash-es';
import { match } from 'ts-pattern';
import { EPIC_POOL } from '../../consts';
import type { countChestEpics } from './count-chest-epics';
import { pickRandomEverydayItems } from './pick-random-everyday-items';
import { pickRandomEpics } from './pick-random-epics';

export const pickRandomChestItems = ({
  random,
  rarities,
  epics,
}: ReturnType<typeof countChestEpics>) =>
  match(epics > 0 && !isEmpty(EPIC_POOL))
    .with(true, () => pickRandomEpics(epics, random))
    .otherwise(() => pickRandomEverydayItems(rarities, random));
