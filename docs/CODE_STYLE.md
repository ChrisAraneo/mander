# Code Style

These rules apply to all TypeScript in this repository. They are taken from
`libs/generator/src/lib/`, which is the reference code: when this
guide says nothing about a case, do what that folder does.

**MUST** and **NEVER** mean exactly that. A rule may only be broken where this
guide names an exception.

Some older files break these rules, for example `structures/join-structures.ts`
and `structures/stack-structures.ts`. Do not copy them. When you change one,
bring it in line.

## 1. Files and folders

1. **One export per file.** Name the file after its export, in kebab-case:
   `pickChestCandidate` → `pick-chest-candidate.ts`, `LevelCategory` →
   `level-category.ts`.
2. **Named exports only.** NEVER use `export default`.
3. **Every file that exports a function has a spec beside it** with the same
   base name: `pick-chest-candidate.spec.ts`. Files in `internal/` get specs
   too.
4. **Each feature gets its own folder:**

   ```text
   chest/
   ├── place-chest.ts                 entry point, the only file callers import
   ├── place-chest.spec.ts
   └── internal/                      private to chest/
       ├── find-chest-candidates.ts
       ├── find-chest-candidates.spec.ts
       └── …
   world/
   ├── get-level-categories.ts        a folder may have several entry points
   ├── pick-random-world-structures.ts
   ├── slice-for-level.ts
   ├── internal/
   └── types/                         types that callers outside world/ use
       ├── level-category.ts
       └── world-structures.ts
   ```

5. **Files at the root of a feature folder are its entry points.** Code outside
   the folder imports only those. NEVER import from another folder's
   `internal/`.
6. **Types get their own file.** A type used only inside a feature goes in
   `internal/<name>.ts` (`stones/internal/field.ts`). A type that callers use
   goes in `types/<name>.ts` (`world/types/level-category.ts`). NEVER declare a
   type in a file that holds a function.
7. **Shared helpers move up a level.** A helper that two features need in the
   same form lives in their parent folder (`structures/patch-tiles.ts`,
   `structures/find-standing-spots.ts`). If each feature needs a slightly
   different version, each keeps its own copy in its `internal/`
   (`cannons/internal/is-averageable-tile.ts` and
   `fireballs/internal/is-averageable-tile.ts`). NEVER add a flag parameter just
   so two features can share one function.
8. **Constants.** A tuning value that several files or tests need goes in the
   nearest `consts.ts` (for the generator: `libs/generator/src/lib/consts.ts`).
   A value only one file needs is a non-exported `UPPER_SNAKE_CASE` constant at
   the top of that file: `const SHED_ROUNDS = 2;`. Name every number whose
   meaning is not plain from the line it sits on.
9. **Freeze exported arrays and objects** and type them `readonly`:

   ```ts
   export const VERTICAL_LEVELS: readonly number[] = Object.freeze([2, 5]);
   ```

## 2. Functions

1. **Arrow functions only**, assigned to a `const`. NEVER use the `function`
   keyword, classes or `this`.
2. **Single-expression bodies.** Write `(tiles) => …`, not
   `(tiles) => { return …; }`.
   - To name a value in the middle of an expression, pass it through
     `chain(value).thru(…).value()`:

     ```ts
     chain(filter(findNeighbourTiles(tiles, row, column), isAverageableTile))
       .thru((solid) => maxBy(uniq(solid), (tile) => countOf(solid, tile)))
       .thru((average) => average ?? TILE_BRICK)
       .value();
     ```

   - When a function needs several named values, a block body is allowed if it
     holds only `const` declarations and one `return` at the end (see
     `world/slice-for-level.ts`).
3. **No mutation.** NEVER use `let` or `var`, reassign a name, or change an
   argument. Return new arrays and objects. Copy a row with `[...row]`. Lodash
   `reverse` changes the array it is given, so copy first: `reverse([...row])`.
4. **No loops.** NEVER use `for`, `while`, `for…of` or `forEach`. Use lodash
   `map`, `flatMap`, `filter`, `reduce`, `times` and `range`.
   - The only exception is a hot numeric inner loop whose mutation never leaves
     the function. `stones/internal/sum-taps.ts` is the only one. Add another
     only after you have measured that it is needed.
5. **Argument order.** The grid (`tiles`) comes first. `row` always comes before
   `column`, both in arguments and in objects: `isSurface(tiles, row, column)`,
   `{ row, column, tile }`.
6. **Entry points and helpers take plain arguments. Pipeline steps take one
   object** (see section 4).
7. **Return types.** Helpers MUST declare their return type. Pipeline steps and
   entry points MUST NOT, because their types are inferred and the next step
   reads them through `ReturnType<typeof …>`.

   A helper:

   ```ts
   export const getRank = (
     levelCategories: LevelCategory[],
     index: number,
   ): number => countIn(take(levelCategories, index), levelCategories[index]);
   ```

   A step:

   ```ts
   export const pickKeyCandidate = ({
     tiles,
     candidates,
   }: ReturnType<typeof sortKeyCandidates>) => ({
     tiles,
     candidate: head(candidates),
   });
   ```

## 3. Branching

1. **NEVER use `if`, `else`, `switch` or the `?:` operator.** Branch with
   `match` from `ts-pattern`.
2. **Unions:** one `.with()` for each member, ending in `.exhaustive()`:

   ```ts
   match(levelType)
     .with('HORIZONTAL', () => groupIntoColumnSlots(tiles, candidates))
     .with('VERTICAL', () => groupIntoRowSlots(tiles, candidates))
     .exhaustive();
   ```

3. **Booleans and other open values:** `.with(true, …)` or `.with(value, …)`,
   ending in `.otherwise(…)`.
4. **Missing values:** pull the pattern out of `P` once, at the top of the file,
   then match on it:

   ```ts
   const { nullish } = P;

   …
     .with(nullish, () => [])
     .otherwise((found) => standTiles(found, TILE_CHEST, CHEST_HEIGHT))
   ```

5. **Conditions:** use `.when(predicate, handler)`, or a `P` pattern such as
   `number.lt(0)` after `const { number } = P;`.
6. **Name special values before you match on them:** `const NOT_FOUND = -1;`,
   then `.with(NOT_FOUND, () => 0)`.
7. **Keep unions typed.** When handlers return members of a string union, put
   the type on the handler: `.with(true, (): LevelType => 'VERTICAL')`.
8. **Small cases need no `match`.** Use `??` for a fallback
   (`BEARTRAP_REMOVAL_RATES[levelNumber - 1] ?? NOTHING_REMOVED`), `?.` for reads
   that may fall off the grid (`tiles[row]?.[column]`), and `&&`, `||` and `!`
   inside predicates.
9. **Keep each branch to one call.** When a branch needs more, move it into its
   own helper file and call that (`filterLeftOfPortal`, `filterBelowPortal`).

## 4. Pipelines

A change made in more than one step is a pipeline. Every pipeline has this
shape.

1. **The entry point** takes plain arguments, packs them into one object and
   runs the steps with `flow` from `lodash-es`. It does nothing else.

   ```ts
   export const clearBeartraps = (tiles: Tile[][], levelNumber: number) =>
     flow(
       getBeartrapRemovalRate,
       findBeartrapCells,
       shuffleBeartrapCells,
       pickBeartrapCells,
       createBeartrapPatches,
       patchBeartrapTiles,
     )({ tiles, levelNumber });
   ```

2. **One step per file**, in `internal/`. A step takes one object,
   destructures it in its parameter list and returns a new object.
3. **Step input types.** The first step writes its input type inline. Every
   later step uses the return type of the step before it, imported with
   `import type`:

   ```ts
   import { head } from 'lodash-es';
   import type { sortChestCandidates } from './sort-chest-candidates';

   export const pickChestCandidate = ({
     tiles,
     candidates,
   }: ReturnType<typeof sortChestCandidates>) => ({
     tiles,
     candidate: head(candidates),
   });
   ```

4. **Pass on only what later steps read.** Pass each field on unchanged: the
   same object, not a copy. Drop a field as soon as no later step reads it:
   `sortChestCandidates` drops `levelType` and `pickBeartrapCells` drops `rate`.
5. **The last step returns the result itself**, not an object. `patchChestTiles`
   returns the new `Tile[][]`.
6. **Change tiles through patches.** Collect the changes as `TilePatch` values
   (`{ row, column, tile }`) in a `create…Patches` step, then apply them with
   `patchTiles(tiles, patches)` in the last step. NEVER write into a grid.
7. **Standard steps.** A pipeline that places or removes things on a grid uses
   the standard steps from `docs/VERBS.md`, in the order given there.
8. **One pipeline for both level types.** Horizontal and vertical levels go
   through the same steps. Branch on `levelType` inside the steps that differ,
   never in the entry point.
9. **One random generator.** NEVER use `Math.random`. In the generator, only
   `generate` calls `createRandom`: it makes one generator from the world name
   and passes it down. Everything else takes that generator as its last
   argument, named `random` (`clearSpikes(tiles, levelNumber, random)`), and
   NEVER builds a seed or a generator of its own. A pipeline carries `random`
   as a field until the last step that draws from it. Shuffle with
   `sortBy(items, () => random.rollFloat())`. Each draw moves the generator
   on, so the order of the calls is part of the output: one draw more or less
   anywhere changes everything drawn after it. The same day MUST always give
   the same world.

## 5. Naming

1. **Case.** `camelCase` for functions and values, `PascalCase` for types,
   `UPPER_SNAKE_CASE` for module constants and for string-union members
   (`'HORIZONTAL'`), `kebab-case` for files and folders.
2. **Functions start with a verb from `docs/VERBS.md`**, used in the meaning
   given there. NEVER use a verb that is not listed there.
3. **Steps carry the feature's name**, so no two steps in the repo share a name:
   `findChestCandidates`, never `findCandidates`. A helper that serves one step
   may use a shorter name that fits its job (`filterLeftOfPortal`,
   `getColumnPriority`).
4. **Use words, not letters.** Callback parameters say what they hold:
   `(candidate) => candidate.column`, `(cells, row) => …`,
   `(tile, column) => …`. NEVER use one-letter names. Name a parameter you do
   not use `_`.
5. **Use the project's words:**

   | Word                 | Meaning                                                                                                                     |
   | -------------------- | --------------------------------------------------------------------------------------------------------------------------- |
   | `tiles`              | a grid, `Tile[][]`, read as `tiles[row][column]`                                                                            |
   | `row`, `column`      | a position in a grid; never `x` and `y`                                                                                     |
   | `cells`              | in a pipeline, the `{ row, column }` positions of tiles to change; in `map(tiles, (cells, row) => …)`, the tiles of one row |
   | `Spot`, `candidates` | solid tiles something could stand on; the thing goes in the rows above                                                      |
   | `patches`            | `TilePatch[]`, changes waiting to be applied                                                                                |
   | `slots`              | candidates grouped by range of columns or rows                                                                              |
   | `levelNumber`        | counts from 1; `index` counts from 0. Convert where you use it: `RATES[levelNumber - 1]`                                    |
   | `levelType`          | `'HORIZONTAL' \| 'VERTICAL'`                                                                                                |
   | `Field`              | a grid of numbers; flags in it are `0` or `1`, made with `toFlag`                                                           |

6. **Keep `docs/FUNCTION_NAMES.md` up to date.** Check it before you name a
   function and reuse its words. Add every name you add and remove every name
   you delete. The list is in alphabetical order, ignoring case.

## 6. Types

1. **`interface` for object shapes; `type` for unions, aliases, records and
   function types:**

   ```ts
   export interface Spot {
     row: number;
     column: number;
   }

   export type LevelCategory = 'NORMAL' | 'HARD' | 'VERTICAL';

   export type WorldStructures = Record<LevelCategory, Sector[]>;
   ```

2. **String unions for fixed sets of values.** NEVER use `enum`.
3. **NEVER use** `any`, non-null assertions (`!`), `@ts-ignore`,
   `@ts-expect-error` or `as` casts in source files.
4. **Reuse types instead of writing them out again:** `ReturnType<typeof step>`
   for step inputs, `ReturnType<typeof createRandom>` for a random generator.
5. **Import types as types:** `import type { Tile } from '@mander/model';`, or
   `import { type Tile, TILE_AIR } from '@mander/model';` when one line brings
   in both. The compiler checks this (`verbatimModuleSyntax`).

## 7. Libraries

1. **`lodash-es` for collections**, called as functions and imported by name:
   `map(tiles, …)`, `size(cells)`, `head(candidates)`. NEVER call array methods
   (`tiles.map(…)`) and NEVER read `.length`; use `size()`.
2. **`chain` comes from `@mander/utils`**, never from `lodash-es`. End every
   chain with `.value()`.
3. **`flow`** from `lodash-es` runs pipelines.
4. **`match` and `P`** from `ts-pattern` do all branching.
5. **`createRandom`** from `@mander/utils` makes every random number.
6. **Arithmetic.** Use lodash `floor`, `ceil`, `round` and `sum`, and lodash
   `max` and `min` on arrays. Use `Math.abs`, `Math.min` and `Math.max` on
   single numbers.
7. **Sorting.** `sortBy` keeps tied items in their old order, and tests depend
   on it. Sort from high to low by negating the key
   (`(candidate) => -candidate.column`). Break ties with a list of keys:

   ```ts
   sortBy(candidates, [
     (candidate) => candidate.row,
     (candidate) => Math.abs(candidate.column - getMiddleColumn(tiles)),
   ]);
   ```

8. **Imports from another library** use the `@mander/*` aliases. Imports inside
   a library use relative paths.

## 8. Layout and comments

1. **Prettier decides the formatting** (`npm run format`): single quotes,
   semicolons, trailing commas, two-space indents, 80 columns.
2. **Import order:** package imports first, then relative imports. Sort each
   group by path.
3. **Source files have no blank line between the two import groups. Spec files
   have exactly one.**
4. **One blank line between top-level statements.** `const { nullish } = P;`
   goes right after the imports.
5. **No comments.** Names and tests explain the code. The only comments allowed
   are tool directives, such as `// eslint-disable-next-line`.

## 9. Tests

1. **Vitest.** Import `describe`, `expect` and `it` from `vitest` by name. NEVER
   use mocks, spies, `beforeEach`, `afterEach`, snapshots, `.only`, `.skip` or
   `it.each`.
2. **One `describe` per file, named exactly after the function:**
   `describe('pickChestCandidate', …)`. Only a spec that checks behaviour across
   several features uses a plain-English title (`back-layer.spec.ts`,
   `vertical-climb.spec.ts`).
3. **Titles read `should … when …`**, in plain everyday English about the game,
   not the code. Call the function "it". Say "the grid", "spots" and "marks",
   not `tiles`, `cells` and `patches`:
   - `'should keep the grid the same when it makes the marks'`
   - `'should give no spots when the grid holds no trap'`
   - `'should put the chest two columns left of the portal in a horizontal level when the floor there is free'`
4. **Test each step on its own.** Every step in `internal/` has its own spec.
   The entry point's spec checks the feature as a whole.
5. **Every spec covers:**
   - the main behaviour, and the empty case (an empty grid, no candidates);
   - for a pipeline step: one test for each field it passes on, using `toBe` to
     show the same object came back (`'should keep the grid the same when …'`,
     `'should pass the level type on when …'`);
   - for an entry point or a `patch…Tiles` step: that the grid it was given is
     unchanged (`'should not change the old grid when …'`);
   - for anything that draws from the generator: a generator started from the
     same seed gives the same result, and one started from another seed gives
     a different one. Give each call its own `createRandom(seed)`, because a
     shared generator moves on with every draw. A step that only passes
     `random` on may share one `RANDOM` constant across its tests;
   - for anything that branches on `levelType`: both `'HORIZONTAL'` and
     `'VERTICAL'`.
6. **Fixtures.**
   - Shared read-only fixtures are `UPPER_SNAKE_CASE` constants:
     `const LEVEL: Tile[][] = [[TILE_DIRT]];`
   - When a test checks that the input is left alone, build the fixture with a
     factory so every call makes a fresh one: `createLevel()`.
   - Draw grids as strings and turn them into tiles through a legend:

     ```ts
     const TILES: Record<string, Tile> = {
       '#': TILE_DIRT,
       o: TILE_GEM,
       P: TILE_PORTAL,
     };

     const createGrid = (rows: string[]): Tile[][] =>
       map(rows, (row) => map([...row], (cell) => TILES[cell] ?? TILE_AIR));
     ```

     Use `.` for air, `#` for dirt, `o` for a gem, `P` for the portal, `C` for
     the chest, `K` for the key and `@` for the spawn.

   - Wrap the call in a helper that returns only the field under test:

     ```ts
     const findCandidates = (rows: string[], levelType: LevelType) =>
       findChestCandidates({ tiles: createGrid(rows), levelType }).candidates;
     ```

7. **Assertions.** `toEqual` for values. `toBe` for primitives and to show the
   same object came back. `toBeCloseTo` for fractions. When you check many
   cases inside `times(…)`, pass a message so a failure names the case:
   ``expect(cleared, `level ${level}`)``.
8. **Inside a test**, separate the setup, the call and the `expect`s with blank
   lines.
9. **A slow test** that needs more than the default time passes a timeout as
   the third argument of `it`: `120000`.
10. **Specs may also:** cast with `as unknown as` to build a fixture that is
    hard to type, write into a fixture grid they have just made, collect calls
    in a local array (`offsets.push(offset)`), and declare small local types.
    Every other rule in this guide applies to specs too.
