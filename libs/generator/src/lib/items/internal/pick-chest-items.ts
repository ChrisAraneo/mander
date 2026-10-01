import { isEmpty } from 'lodash-es';
import { match } from 'ts-pattern';
import { EPIC_POOL } from '../../consts';
import type { countChestEpics } from './count-chest-epics';
import { pickChest } from './pick-chest';
import { pickEpics } from './pick-epics';

export const pickChestItems = ({
  random,
  rarities,
  epics,
}: ReturnType<typeof countChestEpics>) =>
  match(epics > 0 && !isEmpty(EPIC_POOL))
    .with(true, () => pickEpics(epics, random))
    .otherwise(() => pickChest(rarities, random));
