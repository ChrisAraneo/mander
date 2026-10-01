import type { LevelMeta } from '@mander/model';
import { getStructureName, type Sector } from '@mander/structures';
import { map } from 'lodash-es';

export const createLevelMeta = (structures: Sector[]): LevelMeta => ({
  structures: map(structures, getStructureName),
});
