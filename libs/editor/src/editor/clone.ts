import type { Structure } from '@mander/generator';
import { cloneDeep } from 'lodash-es';

export const clone = (grid: Structure): Structure => cloneDeep(grid);
