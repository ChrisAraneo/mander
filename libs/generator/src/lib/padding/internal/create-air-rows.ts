import type { Tile } from '@mander/model';
import { size } from 'lodash-es';
import { createAirGrid } from '../../structures/create-air-grid';

export const createAirRows = (row: Tile[], count: number): Tile[][] =>
  createAirGrid(count, size(row));
