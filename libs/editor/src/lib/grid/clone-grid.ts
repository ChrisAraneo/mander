import type { Structure } from '@mander/generator';
import { cloneDeep } from 'lodash-es';

export const cloneGrid = (grid: Structure): Structure => cloneDeep(grid);
