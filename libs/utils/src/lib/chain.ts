/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable @typescript-eslint/naming-convention */

import * as lodashModule from 'lodash-es';

/**
 * `chain` is only usable via lodash-es' default export.
 *
 * The wrapper's methods (`filter`, `map`, `thru`, ...) are attached by a
 * `mixin(lodash, lodash)` side effect that lives in `lodash.default.js`.
 * Importing `{ chain }` by name never pulls that module in, so Rollup drops the
 * mixin and `chain(x)` returns a wrapper with no methods — which fails only in
 * production builds, never in `nx dev` or vitest.
 *
 * Reaching through the namespace to `.default` keeps `lodash.default.js` (and
 * therefore the mixin) in the bundle. The cast is needed because the ESM type
 * definitions do not describe the default export.
 */
const lodash = (lodashModule as unknown as { default: typeof lodashModule })
  .default;

export const { chain } = lodash;
