import type { Structure } from '@mander/generator';
import { tryCatch } from 'ramda';
import { normalizeGrid } from '../grid/normalize-grid';

export const parseBody: (body: string) => Structure | null = tryCatch(
  (body: string) => normalizeGrid(JSON.parse(body)),
  () => null,
);
