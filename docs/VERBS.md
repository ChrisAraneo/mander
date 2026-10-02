# Verbs

Every function name starts with a verb from this file, and each verb keeps the
one meaning given here. The verb is followed by what it works on:
`findChestCandidates`, `drawStar`. The one prefix that is not a verb is `to…`,
for mapping functions (`toFlag`). Spec helpers follow the same rules.

Look here before you name a function. When no verb fits, add a new one to this
file, with its meaning and an example, in the same change.

## Rules

1. **One meaning per verb.** NEVER use a verb for a job that another verb in
   this file already covers.
2. **Random choices.** A function that chooses something at random MUST be
   named `pickRandom…` (`pickRandomDirtDepth`). NEVER use `deal…` or `roll…`
   for it. Plain `pick…` is for steps that choose from an already ordered list
   (`pickBeartrapCells`), and `shuffle…` is for steps that only mix the order.
   The random generator's own methods (`rollFloat`, `rollInt`, `isRollUnder`,
   `pick`) keep their names.
3. **Reducers take their action's name.** The function that handles an action
   is the action type in camelCase: `JUMP_START` → `jumpStart`, `USE_STAR` →
   `useStar`.
4. **Canvas steps take the canvas name.** A step that wraps one
   `CanvasRenderingContext2D` method has that method's name: `beginPath`,
   `clip`, `closePath`, `fill`, `fillRect`, `moveTo`, `restore`, `rotate`,
   `save`, `scale`, `setTransform`, `stroke`, `translate`. These names do not
   follow the meanings below.
5. **Standard pipeline steps.** A pipeline that places or removes things on a
   grid uses these steps in this order, skipping the ones it does not need:

   | Step                             | Job                                  | Example                                       |
   | -------------------------------- | ------------------------------------ | --------------------------------------------- |
   | `get…` / `mark…`                 | read the settings for this level     | `getSpikeRemovalRate`, `markCannonsArmed`     |
   | `find…Candidates` / `find…Cells` | collect positions from the grid      | `findChestCandidates`, `findSpikeCells`       |
   | `filter…` / `group…`             | drop or group those positions        | `filterChestCandidates`, `groupGemCandidates` |
   | `sort…` / `shuffle…`             | put the best first, or mix at random | `sortPortalCandidates`, `shuffleSpikeCells`   |
   | `pick…`                          | choose from the ordered list         | `pickKeyCandidate`, `pickBeartrapCells`       |
   | `create…Patches`                 | turn the choice into patches         | `createGemPatches`                            |
   | `patch…Tiles`                    | apply the patches                    | `patchGemTiles`                               |

   Other pipelines name their middle steps with plain verbs
   (`smoothStoneCells`, `stackPaddingRows`), but still end with
   `create…Patches` and `patch…Tiles` when they change tiles.

## Reading values

- `check…` — Test a whole level and return a map of the result. Use it when the
  answer covers every cell, not one value (`checkPlayerReach`).
- `compute…` — Work a value out from several others, including a size such as
  a height, a width or a depth. Use it instead of `get…` when the work is more
  than a lookup (`computeLevelScore`, `computeAverageNeighbourTile`,
  `computeStackedHeight`, `computeDepths`). NEVER use `measure…`.
- `count…` — Return how many things there are (`countCompany`,
  `countStartingHearts`).
- `find…` — Search a grid or a list and return what matches, or `undefined`
  when nothing does. In pipelines, `find…Candidates` and `find…Cells` collect
  the positions to work on (`findChestCandidates`, `findPortalTile`).
- `get…` — Look up or work out one value from what it is given: a setting for a
  level, a part of an object, a position or the starting tile there, or every
  item of a kind as an array (`getMiddleColumn`, `getSpikeRemovalRate`,
  `getStartingTile`, `getPlayableWorlds`). NEVER use `list…` or `seed…`. Use
  `find…` instead when you search for the items that match.
- `sum…` — Add numbers up into one total (`sumTaps`).

## Questions

All of these return a boolean.

- `are…` — `is…` for a plural subject (`areEnemiesOverlapping`,
  `areSolidAcross`).
- `can…` — Whether something is allowed or able to happen (`canWard`,
  `canBeBehind`).
- `has…` — Whether something owns a thing, or whether an event has already
  happened (`hasMoonMagnet`, `hasFallenIntoPit`).
- `is…` — Whether one thing is in a given state (`isSurface`, `isSolidTile`).

## Choosing and ordering

- `choose…` — The player chooses one option. Only the `CHOOSE_ITEM` reducer
  uses it (`chooseItem`).
- `filter…` — Drop the items that do not match and keep the rest in order
  (`filterChestCandidates`, `filterNewestRuns`). For one value, let it through
  only when it matches, and otherwise return `null`, `[]` or a fallback
  (`filterInLevel`, `filterPlaying`). NEVER use `keep…`.
- `group…` — Split a list into groups, such as candidates by range of columns
  (`groupGemCandidates`, `groupIntoRowSlots`).
- `pick…` — Choose from a list that is already in order, usually from the front
  (`pickChestCandidate`, `pickBeartrapCells`). NEVER use it for a random
  choice.
- `pickRandom…` — Choose something at random by drawing from the `random`
  generator. Every random choice uses this verb (`pickRandomStructures`,
  `pickRandomDirtDepth`).
- `shuffle…` — Mix the order of a list at random without dropping anything
  (`shuffleSpikeCells`, `shuffleByColumn`).
- `sort…` — Put a list in order, best first (`sortPortalCandidates`).
- `take…` — Return the part of a list before or after a point (`takeBefore`,
  `takeAfter`).

## Making values

- `clone…` — Return a copy with new arrays, so changing the copy leaves the
  original alone (`cloneGrid`, `cloneSketch`).
- `create…` — Build a new value from scratch or from its parts. Use it for
  patches (`create…Patches`), canvas steps (`create…Step`), item art
  (`create…Art`), fresh state (`createInitialState`), grids and fixtures
  (`createGrid`), things spaced evenly around a point (`createFireballRing`),
  and factories that return an object with methods (`createRandom`,
  `createRecorder`). NEVER use `spread…`.
- `decode…` — Undo `encode…`: turn the stored form back into the full value,
  dropping the parts that no longer fit (`decodeReplay`, `decodeAction`). Use
  `parse…` first when the stored data is still unknown. NEVER use `unpack…`.
- `encode…` — Turn a value into a smaller form for storing (`encodeReplay`,
  `encodeAction`). NEVER use `pack…`.
- `format…` — Build a string for people or for source code (`formatDateSeed`,
  `formatStructure`).
- `generate…` — Build game content from a seed or the `random` generator. Only
  the generator's top-level entry points use it (`generate`, `generateLevel`,
  `generatePalette`).
- `hash…` — Turn a string or a position into a number that looks random but is
  always the same for the same input, or fold one more character into a
  running hash (`hashString`, `hashTileNoise`, `hashChar`). NEVER use `mix…`.
- `parse…` — Read text or unknown stored data into a typed value, and reject
  what does not fit (`parseStructure`, `parseRawSave`).
- `to…` — Map one value to another type, named after what it returns, usually
  to pass straight to `map` (`toFlag`, `toTile`, `toPlayed`). When two return
  the same type, add where the value comes from (`toPlayedFromRun`). NEVER use
  `convert…`.

## Changing grids and fields

- `add…` — Put new things into or around a value and return the bigger result.
  In the generator, `add…` entry points add rows around a grid (`addPadding`);
  elsewhere it adds an item to a collection (`addRun`, `addStops`).
- `blur…` — Average each cell of a field with its neighbours (`blur`,
  `blurRows`).
- `clear…` — Remove things from a grid. In the generator, `clear…` entry points
  remove traps and weapons (`clearSpikes`, `clearLoneStones`); in the editor,
  `clear` empties the sketch.
- `cut…` — Trim a layer to the size a level type needs (`cutLayer`).
- `fill…` — Give every empty cell of a grid a value (`fillSketch`, `fillGrid`).
- `furnish…` — Run all the `place…` entry points for one level
  (`furnishLevel`).
- `join…` — Put several structures together into one grid (`joinStructures`,
  `joinSectors`).
- `lay…` — Build one row of a new grid (`layAcross`).
- `mark…` — Pipeline step that adds a yes-or-no setting for the level without
  changing tiles (`markCannonsArmed`, `markFireballsLit`).
- `mirror…` — Flip a grid from left to right (`mirrorTiles`, `mirrorLayers`).
- `multiply…` — Multiply two fields cell by cell, so a `0` flag wipes out the
  other value (`multiplyFields`).
- `normalise…` — Shift positions so the smallest row and column become `0`
  (`normalisePlacements`).
- `pad…` — Add space around a value: rows around a level (`padLevel`), or zeros
  in front of a number (`pad2`).
- `patch…` — Apply changes and return the new value. `patch…Tiles` is the last
  step of a pipeline that changes tiles (`patchTiles`, `patchChestTiles`);
  `patchInput` changes fields of the player's input.
- `place…` — Entry point that adds things to a grid (`placeChest`,
  `placeStones`).
- `remove…` — Take every copy of one value out of a grid or a store
  (`removeMarker`, `removeItem`).
- `sharpen…` — Turn every cell of a field into a flag: `1` when it reaches a
  threshold, otherwise `0` (`sharpen`).
- `slice…` — Take the part of a list that one level gets (`sliceForLevel`).
- `smooth…` — Round off the edges of a shape in a field so it looks natural
  (`smoothStoneCells`).
- `soften…` — Blur a field several times over (`soften`).
- `split…` — Split one value into parts, such as a structure into its front and
  back layers (`splitStructureLayers`).
- `stack…` — Put rows on top of each other (`stackPaddingRows`).
- `stand…` — Make the patches for a thing standing on a spot, in the rows above
  it (`standTiles`).
- `underpin…` — Fill the air below a structure with its bottom tiles, so it
  does not float (`underpinLayer`).

## Numbers, colours and positions

- `centre…` — Return the offset that puts something in the middle of a view
  (`centreView`).
- `clamp…` — Keep a number inside a range by cutting it off at the ends
  (`clampIndex`).
- `follow…` — Return a camera offset that keeps a point in view
  (`followFocus`).
- `interpolate…` — Blend two game states for a frame drawn between two ticks
  (`interpolateState`).
- `lerp…` — Blend two numbers or points by a fraction (`lerp`, `lerpPoint`).
- `project…` — Map a value onto an axis: a shape onto a line for collisions
  (`project`), or a fraction onto pixels (`projectX`).
- `push…` — Move a value away from one it must not be near
  (`pushAwayFromEntityHue`).
- `shift…` — Change a colour by a fixed amount (`shiftHsl`).
- `snap…` — Jump at once to a fixed position or state: round to a whole device
  pixel (`snapToDevicePixel`), or close a beartrap (`snapShut`).
- `tween…` — Move the player or the enemies part of the way between two ticks,
  for drawing (`tweenPlayer`, `tweenEnemies`).
- `wrap…` — Keep an angle or a hue inside its range by going round
  (`wrapHue`, `wrapAngle`).

## Game engine

- `advance…` — Move every thing of one kind, or a clock, forward by one tick,
  usually by calling `step…` on each (`advanceBullets`, `advanceFrame`).
- `aim…` — Turn a cannon towards the player (`aim`).
- `apply…` — Put a set of changes onto a state: actions, motion, stomps or a
  canvas style (`applyActions`, `applyEnemyMotion`, `applyStyle`).
- `burn…` — Hurt things with fire, or use up a star (`burnEnemies`,
  `burnStar`).
- `complete…` — Finish the level and add its score (`complete`).
- `cool…` — Count timers down by the time that passed (`coolTimers`, `cool`).
- `crush…` — Kill the enemies caught in an armed beartrap (`crushEnemies`).
- `end…` — Finish the game or a run (`endGame`, `endRun`).
- `expand…` — Grow a set step by step until nothing new is added
  (`expandReach`).
- `fall…` — Move something down under gravity, or drop the player into a pit
  (`fall`, `fallIntoPit`).
- `fire…` — Launch a new shot (`fireBullet`, `fireCannonball`).
- `flip…` — Switch a two-way value to its other side (`flipFacing`,
  `flipMoonMagnet`).
- `fly…` — Let a shot carry on when it hits nothing (`flyOn`).
- `hold…` — Wait without acting this tick (`holdFire`).
- `hurt…` — Take damage and start the hurt timers (`hurt`).
- `interact…` — The `INTERACT` reducer: open a chest or go through the portal
  (`interact`).
- `jump…` — Start or stop a jump (`jumpStart`, `jumpStop`).
- `kill…` — Make the player or an enemy start dying (`killPlayer`,
  `killEnemy`).
- `lose…` — Give something up: a heart, or an enemy to a pit (`loseHeart`,
  `loseToThePit`).
- `move…` — Change where something is: along one axis with collisions
  (`moveHorizontal`), or start and stop walking (`moveLeftStart`).
- `patrol…` — Walk an enemy back and forth (`patrol`).
- `reduce…` — Apply one action to the game state and return the next state
  (`reduce`).
- `reload…` — Fill something back up to full (`reloadBarrage`).
- `resolve…` — Settle what happens after a move: landings, hits and harm
  (`resolveLanding`, `resolveHarm`). In the editor plugins, it turns a folder
  into full file paths (`resolveStructurePaths`).
- `respawn…` — Put the player back at the start of the level after a death
  (`respawn`).
- `restart…` — Start again from the beginning (`restart`, `restartRun`).
- `shatter…` — Break a tile (`shatterSpikeTile`).
- `shield…` — Keep the player safe from harm for a while (`shieldPlayer`).
- `shoot…` — Fire, or bring something down with a shot (`shoot`,
  `shootDown`).
- `simulate…` — Play moves forward on a copy of the state to see where they end
  (`simulatePlan`, `simulateFlights`).
- `step…` — Move one thing forward by one tick (`stepEnemy`, `stepBullet`).
- `stomp…` — Hurt the enemies the player lands on (`stompVictims`).
- `strike…` — Hit an enemy or a spike with a shot (`strikeDown`).
- `sweep…` — Move a box in small steps along one axis and stop at the first
  solid tile (`sweep`).
- `tick…` — The `TICK` reducer: move the whole game forward by one fixed step
  (`tick`).
- `toggle…` — Switch something on or off (`toggleMoonMagnet`, `togglePause`).
- `turn…` — Decide which way an enemy faces next (`turnOnBlock`,
  `turnAtBound`).

## Drawing

- `draw…` — Draw one kind of thing onto a canvas context straight away. It
  returns nothing (`drawStar`, `drawChest`).
- `outline…` — Canvas step that strokes the current path with the dark outline
  (`outline`).
- `paint…` — Run canvas steps on a context (`paint`), or draw into a canvas
  element (`paintInto`). In the editor, `paint` sets a cell to the brush value.
- `render…` — Draw a whole frame of the game (`renderGame`, `renderState`).
- `repaint…` — Draw a canvas again after its data changed (`repaint`).
- `resize…`, `fit…` — Match a canvas's size to its element and the device's
  pixel ratio (`resizeCanvas`, `fitCanvas`). `refit` does it again.
- `run…` — Turn a context call into a canvas step (`run`), or run steps only
  when a condition holds (`runWhen`).
- `sequence…` — Join canvas steps into one step that runs them in order
  (`sequence`).
- `skip…` — Canvas step that does nothing (`skip`).
- `stroke…` — Draw lines on a canvas (`strokeTileEdges`, `strokeOutline`).
- `trace…` — Add a shape to the current canvas path without filling or
  stroking it (`traceStar`, `traceRect`).

## Saving, loading and files

- `append…` — Add to the end of a text or a list (`appendName`,
  `appendDeclaration`, `append`).
- `archive…` — Store a finished run in the save (`archiveRun`).
- `configure…` — The Vite plugin hook, named by Vite (`configureServer`).
- `fetch…` — Get data from the editor's server (`fetchLibrary`).
- `insert…` — Add a name to a list inside source text, if it is not there yet
  (`insertName`).
- `load…` — Bring data into use: a level into the game state, the save from
  storage, the library from the server (`loadLevel`, `loadSave`, `load`).
- `merge…` — Combine two lists into one without repeats (`mergeAliases`,
  `mergeLandings`).
- `persist…` — Write data to `localStorage`, trimming it until it fits
  (`persist`, `persistProgress`).
- `post…` — Send data to the editor's server (`postStructure`).
- `read…` — Read files or a request body (`readLibrary`, `readBody`).
- `record…` — Write down an action or a played world as it happens (`record`,
  `recordPlayedWorld`).
- `register…` — Add a structure to the library's import list and table
  (`registerStructure`).
- `reject…` — Turn a failed response into a rejected promise
  (`rejectFailure`).
- `replace…` — Swap a value for a new one (`replace`).
- `restore…` — Put back what was there before (`restoreEndings`).
- `save…` — Write data to storage or to a file (`saveScore`, `saveStructure`,
  the run archive's `save`).
- `send…` — Write an HTTP response (`send`).
- `snapshot…` — Return a copy of what has been recorded so far (`snapshot`).
- `strip…` — Cut unwanted parts out of a text (`stripComments`).
- `trim…` — Make data smaller by dropping its oldest parts (`trimSave`).
- `upsert…` — Replace an entry if it exists, otherwise add it
  (`upsertStructure`).

## Apps and the editor

- `capture…` — React to an action as it passes, to record and archive the run
  (`capture`).
- `close…` — Close something that is open: the chest window (`close`), a
  canvas (`closeCanvas`), a list in source text (`closeList`).
- `confirm…` — Handle the player pressing confirm (`confirm`,
  `confirmComplete`).
- `copy…` — Copy text to the clipboard (`copy`).
- `cycle…` — Move to the next value in a fixed loop (`cycleSpeed`).
- `dispatch…` — Send an action to the game (`dispatch`).
- `dispose…` — Remove listeners and free what an object holds (`dispose`).
- `handle…` — Event handler: reply to a key, a request or a stop
  (`handleKeyDown`, `handle`, `handleStop`).
- `leave…` — Handle the pointer leaving an element (`leave`).
- `log…` — Write information to the console for debugging (`logWorldMeta`).
- `mutate…` — Change an internal state object in place. Only the small state
  cells behind factories use it (`mutate`).
- `open…` — Open something for use (`openCanvas`).
- `play…` — Start playing a replay (`playOnMount`).
- `remember…` — Store the current sketch in the undo history (`remember`).
- `reset…` — Put an object back to how it started (`reset`).
- `set…` — Write one value into a Vue ref or a store (`setRef`, `setItem`).
- `show…` — Make a message visible (`showBlocked`).
- `start…`, `stop…` — Begin or end something that keeps running
  (`startOnMount`, `startNextLevel`, `stop`).
- `suggest…` — Offer a value the user can accept (`suggestName`).
- `sync…` — Copy state from one place to another so the two match
  (`syncViewport`, `syncDebugGlobals`).
- `tap…` — Run a side effect and return the value unchanged (`tapEffect`).
- `undo…` — Go back to the last remembered sketch (`undo`).
- `use…` — Vue composable that sets up state and effects for a component
  (`useGame`, `useEditor`). The only other use is the `useStar` reducer, by
  rule 3.

## Spec helpers

These verbs appear only in spec files.

- `act…` — Run one action through the reducer (`act`).
- `drop…` — Take one column out of a fixture (`dropColumn`).
- `enter…` — Go through the portal (`enterPortal`).
- `erase…` — Turn marker tiles into air (`eraseMarkers`).
- `leap…` — Run a beartrap until it has leapt and landed (`leapAndLand`).
- `stub…` — Build a fake canvas context that records its calls (`stub`).
