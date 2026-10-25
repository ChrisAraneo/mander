import { match } from 'ts-pattern';
import { STRUCTURE_END, STRUCTURE_START } from '../../consts';
import type { Layer } from '../../types/layer';
import {
  VERTICAL_ARRIVAL_ROWS,
  VERTICAL_END_ROW,
  VERTICAL_LANDING_ROW,
  VERTICAL_LAUNCH_ROW,
  VERTICAL_MARKER_COLUMN,
  VERTICAL_PLATFORM_COLUMNS,
  VERTICAL_SHAFT_COLUMNS,
  VERTICAL_START_ROW,
} from '../consts';
import { hasAllEmptyCells } from './has-all-empty-cells';
import { hasAllEmptyRows } from './has-all-empty-rows';
import { hasAllSolidCells } from './has-all-solid-cells';
import { hasAnyLandingLedge } from './has-any-landing-ledge';
import { isMarkerAt } from './is-marker-at';
import type { VerticalRuleKind } from './types/vertical-rule-kind';

export const isVerticalRuleMet = (
  structure: Layer,
  kind: VerticalRuleKind,
): boolean =>
  match(kind)
    .with('EMPTY_END_ROW', () => hasAllEmptyRows(structure, [VERTICAL_END_ROW]))
    .with('MARKED_END', () =>
      isMarkerAt(
        structure,
        STRUCTURE_END,
        VERTICAL_END_ROW,
        VERTICAL_MARKER_COLUMN,
      ),
    )
    .with('EMPTY_ARRIVAL_ROWS', () =>
      hasAllEmptyRows(structure, VERTICAL_ARRIVAL_ROWS),
    )
    .with('MARKED_START', () =>
      isMarkerAt(
        structure,
        STRUCTURE_START,
        VERTICAL_START_ROW,
        VERTICAL_MARKER_COLUMN,
      ),
    )
    .with('LAUNCH_PLATFORM', () =>
      hasAllSolidCells(
        structure,
        VERTICAL_LAUNCH_ROW,
        VERTICAL_PLATFORM_COLUMNS,
      ),
    )
    .with('OPEN_LANDING_SHAFT', () =>
      hasAllEmptyCells(
        structure,
        [VERTICAL_LANDING_ROW],
        VERTICAL_SHAFT_COLUMNS,
      ),
    )
    .with('LANDING_LEDGE', () => hasAnyLandingLedge(structure))
    .exhaustive();
