import type { Structure } from '@mander/generator';

import { createAirGrid } from './create-air-grid';
import { fillGroundRow } from './fill-ground-row';

export const createFlatGrid = (): Structure => fillGroundRow(createAirGrid());
