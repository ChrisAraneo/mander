import { some } from 'lodash-es';
import type { Layer } from '../../types/layer';
import {
  VERTICAL_HEADROOM_ROWS,
  VERTICAL_LANDING_BANDS,
  VERTICAL_LANDING_ROW,
} from '../consts';
import { hasAllEmptyCells } from './has-all-empty-cells';
import { hasAllSolidCells } from './has-all-solid-cells';

export const hasAnyLandingLedge = (structure: Layer): boolean =>
  some(
    VERTICAL_LANDING_BANDS,
    (band) =>
      hasAllSolidCells(structure, VERTICAL_LANDING_ROW, band) &&
      hasAllEmptyCells(structure, VERTICAL_HEADROOM_ROWS, band),
  );
