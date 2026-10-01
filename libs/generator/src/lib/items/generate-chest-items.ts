import type { Item } from '@mander/model';
import { createRandom } from '@mander/utils';
import { isEmpty } from 'lodash-es';
import { match } from 'ts-pattern';
import { EPIC_POOL } from '../consts';
import { countEpics } from './internal/count-epics';
import { dealChest } from './internal/deal-chest';
import { dealEpics } from './internal/deal-epics';
import { formatChestSeed } from './internal/format-chest-seed';
import { rollRarities } from './internal/roll-rarities';

export const generateChestItems = (seed: string): Item[] => {
  const random = createRandom(formatChestSeed(seed));
  const rarities = rollRarities(random);

  return match(countEpics(rarities))
    .when(
      (epics) => epics > 0 && !isEmpty(EPIC_POOL),
      (epics) => dealEpics(epics, random),
    )
    .otherwise(() => dealChest(rarities, random));
};
