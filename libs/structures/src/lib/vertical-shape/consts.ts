import { range } from 'lodash-es';

export const VERTICAL_HEIGHT = 22;

export const VERTICAL_MARKER_COLUMN = 9;

export const VERTICAL_END_ROW = 0;

export const VERTICAL_LAUNCH_ROW = 1;

export const VERTICAL_PLATFORM_COLUMN = VERTICAL_MARKER_COLUMN;

export const VERTICAL_PLATFORM_LENGTH = 1;

export const VERTICAL_PLATFORM_COLUMNS: readonly number[] = Object.freeze(
  range(
    VERTICAL_PLATFORM_COLUMN,
    VERTICAL_PLATFORM_COLUMN + VERTICAL_PLATFORM_LENGTH,
  ),
);

export const VERTICAL_START_ROW = VERTICAL_HEIGHT - 1;

export const VERTICAL_SHAFT_COLUMNS: readonly number[] = Object.freeze(
  range(8, 12),
);

export const VERTICAL_AIR_GAP = 3;

export const VERTICAL_BAND_HEIGHT = VERTICAL_HEIGHT - 1;

export const VERTICAL_LANDING_ROW =
  VERTICAL_BAND_HEIGHT + VERTICAL_LAUNCH_ROW - VERTICAL_AIR_GAP - 1;

export const VERTICAL_LANDING_BANDS: readonly (readonly number[])[] =
  Object.freeze([Object.freeze(range(3, 7)), Object.freeze(range(13, 17))]);

export const VERTICAL_HEADROOM_ROWS: readonly number[] = Object.freeze(
  range(VERTICAL_LANDING_ROW - 2, VERTICAL_LANDING_ROW),
);

export const VERTICAL_ARRIVAL_ROWS: readonly number[] = Object.freeze(
  range(VERTICAL_LANDING_ROW + 1, VERTICAL_HEIGHT),
);

export const VERTICAL_IGNORED_ROWS: readonly number[] = Object.freeze(
  range(VERTICAL_BAND_HEIGHT, VERTICAL_HEIGHT),
);
