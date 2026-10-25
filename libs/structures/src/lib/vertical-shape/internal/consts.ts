import { join, map } from 'lodash-es';
import {
  VERTICAL_ARRIVAL_ROWS,
  VERTICAL_END_ROW,
  VERTICAL_HEADROOM_ROWS,
  VERTICAL_LANDING_BANDS,
  VERTICAL_LANDING_ROW,
  VERTICAL_LAUNCH_ROW,
  VERTICAL_MARKER_COLUMN,
  VERTICAL_PLATFORM_COLUMN,
  VERTICAL_PLATFORM_LENGTH,
  VERTICAL_SHAFT_COLUMNS,
  VERTICAL_START_ROW,
} from '../consts';
import { formatSpan } from './format-span';
import type { VerticalRule } from './types/vertical-rule';

export const VERTICAL_RULES: readonly VerticalRule[] = Object.freeze([
  {
    message: `row ${VERTICAL_END_ROW} is the shaft the player leaves through and must be empty`,
    kind: 'EMPTY_END_ROW',
  },
  {
    message: `the end must be marked in row ${VERTICAL_END_ROW}, column ${VERTICAL_MARKER_COLUMN}, where the sector above is entered`,
    kind: 'MARKED_END',
  },
  {
    message: `rows ${join(VERTICAL_ARRIVAL_ROWS, ', ')} are the hall the player arrives in and must be empty`,
    kind: 'EMPTY_ARRIVAL_ROWS',
  },
  {
    message: `the start must be marked in row ${VERTICAL_START_ROW}, column ${VERTICAL_MARKER_COLUMN}, where the sector below ends`,
    kind: 'MARKED_START',
  },
  {
    message: `row ${VERTICAL_LAUNCH_ROW} must carry a platform of at least ${VERTICAL_PLATFORM_LENGTH} block from column ${VERTICAL_PLATFORM_COLUMN}, the ledge the player leaves from`,
    kind: 'LAUNCH_PLATFORM',
  },
  {
    message: `row ${VERTICAL_LANDING_ROW} must leave columns ${formatSpan(VERTICAL_SHAFT_COLUMNS)} open so the sector below can be jumped out of`,
    kind: 'OPEN_LANDING_SHAFT',
  },
  {
    message: `row ${VERTICAL_LANDING_ROW} must carry the ledge the player lands on across columns ${join(map(VERTICAL_LANDING_BANDS, formatSpan), ' or ')}, clear of rows ${join(VERTICAL_HEADROOM_ROWS, ' and ')}`,
    kind: 'LANDING_LEDGE',
  },
]);
