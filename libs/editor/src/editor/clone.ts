import { cloneDeep } from 'lodash-es';
import type { Structure } from '@mander/generator';

export const clone = (grid: Structure): Structure => cloneDeep(grid);
