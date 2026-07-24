import {
  AIR,
  BLOCK,
  formatStructure,
  HARD_STRUCTURES,
  MAX_JUMP_TILES,
  NORMAL_STRUCTURES,
  PLAYER_CLEARANCE,
  PLAYER_HEIGHT_TILES,
  SECTOR_WIDTH,
  type Structure,
  STRUCTURE_HEIGHT,
  structureExitLift,
  structureIssues,
} from '@mander/generator';
import { concat, fill, filter, floor, forEach, map } from 'lodash-es';
import { match, P } from 'ts-pattern';

import { airGrid } from './air-grid';
import { clone } from './clone';
import { CELL, COLORS, TOOLS } from './constants';
import { createElement } from './create-element';
import { drawStructure } from './draw-structure';
import { flatGrid } from './flat-grid';
import { parseGrid } from './parse-grid';
import { reachableFromEntry } from './reachable-from-entry';
import { swatch } from './swatch';

const plural = (count: number, noun: string): string =>
  match(count)
    .with(1, () => noun)
    .otherwise(() => `${noun}s`);

const strandedNote = (strandedCount: number): string =>
  match(strandedCount > 0)
    .with(
      true,
      () =>
        ` (${strandedCount} ${plural(strandedCount, 'platform')} unreachable from the entry.)`,
    )
    .otherwise(() => '');

export const mountEditor = (root: HTMLElement): void => {
  let grid = flatGrid();

  const canvas = createElement('canvas');
  const context = canvas.getContext('2d')!;
  const cssWidth = SECTOR_WIDTH * CELL;
  const cssHeight = STRUCTURE_HEIGHT * CELL;
  const pixelRatio = window.devicePixelRatio || 1;
  canvas.width = cssWidth * pixelRatio;
  canvas.height = cssHeight * pixelRatio;
  canvas.style.width = `${cssWidth}px`;
  canvas.style.height = `${cssHeight}px`;

  const status = createElement('div', { className: 'status' });
  const output = createElement('textarea', {
    className: 'output',
    readOnly: true,
    spellcheck: false,
  });
  const loader = createElement('textarea', {
    className: 'loader',
    spellcheck: false,
    placeholder: 'Paste a structure grid here to edit it…',
  });
  const toast = createElement('div', { className: 'toast' });

  const draw = (): void => {
    drawStructure(context, grid, { pixelRatio, cssWidth, cssHeight });
  };

  const refresh = (): void => {
    draw();
    output.value = formatStructure(grid);
    match(structureIssues(grid))
      .with([], () => {
        const { reached } = reachableFromEntry(grid);
        const strandedCount = filter(reached, (isReached) => !isReached).length;
        const lift = structureExitLift(grid);
        status.className = 'status ok';
        status.replaceChildren(
          createElement('div', {
            className: 'headline',
            textContent: '✓ Valid structure',
          }),
          createElement('div', {
            className: 'meta',
            textContent: `Crossable both ways. Exit raises the rest of the level by ${lift} ${plural(lift, 'tile')}.${strandedNote(strandedCount)}`,
          }),
        );
      })
      .otherwise((issues) => {
        status.className = 'status bad';
        status.replaceChildren(
          createElement('div', {
            className: 'headline',
            textContent: '✗ Not usable yet',
          }),
          createElement(
            'ul',
            {},
            ...map(issues, (issue) =>
              createElement('li', { textContent: issue }),
            ),
          ),
        );
      });
  };

  let tool: number = BLOCK;
  let isPainting = false;
  let paintValue: number = BLOCK;

  const cellAt = (
    event: PointerEvent,
  ): { row: number; column: number } | null => {
    const rect = canvas.getBoundingClientRect();
    const column = floor(
      ((event.clientX - rect.left) / rect.width) * SECTOR_WIDTH,
    );
    const row = floor(
      ((event.clientY - rect.top) / rect.height) * STRUCTURE_HEIGHT,
    );
    return match(
      column >= 0 &&
        column < SECTOR_WIDTH &&
        row >= 0 &&
        row < STRUCTURE_HEIGHT,
    )
      .with(true, () => ({ row, column }))
      .otherwise(() => null);
  };

  const paint = (row: number, column: number): void => {
    match(grid[row][column] === paintValue)
      .with(true, () => undefined)
      .otherwise(() => {
        grid[row][column] = paintValue;
        refresh();
      });
  };

  canvas.addEventListener('pointerdown', (event) =>
    match(cellAt(event))
      .with(P.nullish, () => undefined)
      .otherwise((cell) => {
        isPainting = true;
        paintValue = match(grid[cell.row][cell.column] === tool)
          .with(true, (): number => AIR)
          .otherwise((): number => tool);
        canvas.setPointerCapture(event.pointerId);
        paint(cell.row, cell.column);
      }),
  );
  canvas.addEventListener('pointermove', (event) =>
    match(isPainting)
      .with(false, () => undefined)
      .otherwise(() =>
        match(cellAt(event))
          .with(P.nullish, () => undefined)
          .otherwise((cell) => paint(cell.row, cell.column)),
      ),
  );
  const stopPainting = () => {
    isPainting = false;
  };
  canvas.addEventListener('pointerup', stopPainting);
  canvas.addEventListener('pointercancel', stopPainting);

  const load = (nextGrid: Structure): void => {
    grid = clone(nextGrid);
    refresh();
  };

  const showToast = (message: string): void => {
    toast.textContent = message;
    window.setTimeout(() => (toast.textContent = ''), 2500);
  };

  // `.catch` rather than ramda's tryCatch: writeText rejects asynchronously,
  // and tryCatch only intercepts synchronous throws.
  const writeClipboard = (): Promise<void> =>
    Promise.resolve()
      .then(() => navigator.clipboard.writeText(output.value))
      .catch(() => {
        output.select();
        document.execCommand('copy');
      });

  const copyOutput = async (): Promise<void> => {
    await writeClipboard();
    showToast('Copied! Paste it into a pool in structures/library.ts');
  };

  const examples: Array<{ label: string; grid: Structure }> = concat(
    map(NORMAL_STRUCTURES, (structure, index) => ({
      label: `Normal ${index + 1}`,
      grid: structure,
    })),
    map(HARD_STRUCTURES, (structure, index) => ({
      label: `Hard ${index + 1}`,
      grid: structure,
    })),
  );
  const examplesSelect = createElement(
    'select',
    {},
    createElement('option', { value: '', textContent: 'Load an example…' }),
    ...map(examples, (example, index) =>
      createElement('option', {
        value: String(index),
        textContent: example.label,
      }),
    ),
  );
  examplesSelect.addEventListener('change', () => {
    const index = Number(examplesSelect.value);
    match(examplesSelect.value !== '' && Boolean(examples[index]))
      .with(true, () => load(examples[index].grid))
      .otherwise(() => undefined);
    examplesSelect.value = '';
  });

  const toolButtons = map(TOOLS, (toolOption) =>
    createElement('button', {
      className: 'toolbtn',
      textContent: toolOption.label,
      onclick: () => {
        tool = toolOption.value;
        forEach(toolButtons, (button, buttonIndex) =>
          button.classList.toggle('active', TOOLS[buttonIndex].value === tool),
        );
      },
    }),
  );
  toolButtons[0].classList.add('active');

  const toolbar = createElement(
    'div',
    { className: 'toolbar' },
    createElement('span', { className: 'toollabel', textContent: 'Paint:' }),
    ...toolButtons,
    createElement('span', { className: 'spacer' }),
    createElement('button', {
      textContent: 'Flat',
      onclick: () => load(flatGrid()),
    }),
    createElement('button', {
      textContent: 'Fill ground',
      onclick: () => {
        grid[STRUCTURE_HEIGHT - 1] = fill(new Array(SECTOR_WIDTH), BLOCK);
        refresh();
      },
    }),
    createElement('button', {
      textContent: 'Clear',
      onclick: () => load(airGrid()),
    }),
    examplesSelect,
  );

  const validationPanel = createElement(
    'div',
    { className: 'panel' },
    createElement('h2', { textContent: 'Validation' }),
    status,
  );

  const outputPanel = createElement(
    'div',
    { className: 'panel' },
    createElement('h2', { textContent: 'Structure code' }),
    createElement('p', {
      className: 'hint',
      textContent:
        'Paste this array into NORMAL_STRUCTURES or HARD_STRUCTURES in libs/generator/src/lib/structures/library.ts.',
    }),
    output,
    createElement(
      'div',
      { className: 'row' },
      createElement('button', {
        className: 'primary',
        textContent: 'Copy',
        onclick: copyOutput,
      }),
      toast,
    ),
  );

  const loadButton = createElement('button', {
    textContent: 'Load from text',
    onclick: () =>
      match(parseGrid(loader.value))
        .with(P.nullish, () =>
          showToast("Couldn't read that — expected a grid of 0s and 1s."),
        )
        .otherwise((parsed) => {
          load(parsed);
          loader.value = '';
        }),
  });
  const loadPanel = createElement(
    'div',
    { className: 'panel' },
    createElement('h2', { textContent: 'Load / edit existing' }),
    loader,
    createElement('div', { className: 'row' }, loadButton),
  );

  const legend = createElement(
    'div',
    { className: 'legend' },
    swatch(COLORS.block, 'block (1)'),
    swatch(COLORS.enemy, 'enemy (2) — stands on the block below it'),
    swatch(COLORS.pit, 'bottomless pit column'),
    swatch(COLORS.reachable, 'surface reachable from entry'),
    swatch(COLORS.stranded, 'surface stranded'),
    swatch(COLORS.cramped, `less than ${PLAYER_CLEARANCE} cells of headroom`),
    swatch(
      COLORS.player,
      `the player — ${PLAYER_HEIGHT_TILES} cells tall, climbs ${MAX_JUMP_TILES - 1} cells`,
    ),
    createElement(
      'span',
      {},
      'gold line = ground level (enters flush on the left, exits on the right)',
    ),
  );

  const stage = createElement(
    'div',
    { className: 'stage' },
    toolbar,
    canvas,
    legend,
  );
  const side = createElement(
    'div',
    { className: 'side' },
    validationPanel,
    outputPanel,
    loadPanel,
  );

  root.replaceChildren(
    createElement(
      'div',
      { className: 'app' },
      createElement(
        'header',
        {},
        createElement('h1', { textContent: 'Mander Structure Editor' }),
        createElement('p', {
          textContent: `Paint blocks to design a 20-wide level chunk. The bottom row is the ground line: solid = ground, gaps = bottomless pits, blocks floating above bridge them. Stack the right edge up to make the structure exit higher. Drop enemies with the Enemy tool — each needs a block directly beneath it to patrol on. Click or drag to paint; click a matching cell to clear it. The player is ${PLAYER_HEIGHT_TILES} cells tall, so every surface needs ${PLAYER_CLEARANCE} clear cells above it, and a jump climbs at most ${MAX_JUMP_TILES - 1} cells.`,
        }),
      ),
      createElement('div', { className: 'layout' }, stage, side),
    ),
  );

  refresh();
};
