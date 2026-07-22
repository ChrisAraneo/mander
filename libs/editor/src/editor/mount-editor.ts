import {
  AIR,
  BLOCK,
  ENEMY,
  formatStructure,
  HARD_STRUCTURES,
  NORMAL_STRUCTURES,
  SECTOR_WIDTH,
  type Structure,
  STRUCTURE_HEIGHT,
  structureExitLift,
  structureIssues,
} from '@mander/generator';
import { concat, fill, filter, floor, forEach, map } from 'lodash-es';

import { airGrid } from './air-grid';
import { clone } from './clone';
import { CELL, COLORS, TOOLS } from './constants';
import { createElement } from './create-element';
import { flatGrid } from './flat-grid';
import { parseGrid } from './parse-grid';
import { reachableFromEntry } from './reachable-from-entry';
import { swatch } from './swatch';

export function mountEditor(root: HTMLElement): void {
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

  function draw(): void {
    const { surfaces, reached } = reachableFromEntry(grid);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.clearRect(0, 0, cssWidth, cssHeight);

    for (let column = 0; column < SECTOR_WIDTH; column++) {
      if (grid[STRUCTURE_HEIGHT - 1][column] === AIR) {
        context.fillStyle = COLORS.pit;
        context.fillRect(column * CELL, 0, CELL, cssHeight);
      }
    }

    for (let row = 0; row < STRUCTURE_HEIGHT; row++) {
      for (let column = 0; column < SECTOR_WIDTH; column++) {
        if (grid[row][column] !== BLOCK) continue;
        const pixelX = column * CELL;
        const pixelY = row * CELL;
        context.fillStyle = COLORS.block;
        context.fillRect(pixelX + 1, pixelY + 1, CELL - 2, CELL - 2);
        if (row === 0 || grid[row - 1][column] === AIR) {
          context.fillStyle = COLORS.cap;
          context.fillRect(pixelX + 1, pixelY + 1, CELL - 2, 4);
        }
      }
    }

    for (let row = 0; row < STRUCTURE_HEIGHT; row++) {
      for (let column = 0; column < SECTOR_WIDTH; column++) {
        if (grid[row][column] !== ENEMY) continue;
        const pixelX = column * CELL;
        const pixelY = row * CELL;
        const centerX = pixelX + CELL / 2;
        const centerY = pixelY + CELL / 2;
        context.fillStyle = COLORS.enemy;
        context.beginPath();
        context.roundRect(pixelX + 6, pixelY + 6, CELL - 12, CELL - 12, 5);
        context.fill();
        context.fillStyle = '#fdf3ea';
        context.beginPath();
        context.arc(centerX - 4, centerY - 2, 2.6, 0, Math.PI * 2);
        context.arc(centerX + 4, centerY - 2, 2.6, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = '#1c1c28';
        context.beginPath();
        context.arc(centerX - 4, centerY - 2, 1.1, 0, Math.PI * 2);
        context.arc(centerX + 4, centerY - 2, 1.1, 0, Math.PI * 2);
        context.fill();
        if (row + 1 >= STRUCTURE_HEIGHT || grid[row + 1][column] !== BLOCK) {
          context.strokeStyle = COLORS.stranded;
          context.lineWidth = 2;
          context.strokeRect(pixelX + 2, pixelY + 2, CELL - 4, CELL - 4);
        }
      }
    }

    context.strokeStyle = COLORS.line;
    context.lineWidth = 1;
    context.beginPath();
    for (let column = 0; column <= SECTOR_WIDTH; column++) {
      context.moveTo(column * CELL + 0.5, 0);
      context.lineTo(column * CELL + 0.5, cssHeight);
    }
    for (let row = 0; row <= STRUCTURE_HEIGHT; row++) {
      context.moveTo(0, row * CELL + 0.5);
      context.lineTo(cssWidth, row * CELL + 0.5);
    }
    context.stroke();

    context.strokeStyle = COLORS.ground;
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(0, (STRUCTURE_HEIGHT - 1) * CELL);
    context.lineTo(cssWidth, (STRUCTURE_HEIGHT - 1) * CELL);
    context.stroke();

    forEach(surfaces, (surface, surfaceIndex) => {
      const row = STRUCTURE_HEIGHT - 1 - surface.height;
      context.fillStyle = reached[surfaceIndex]
        ? COLORS.reachable
        : COLORS.stranded;
      context.beginPath();
      context.arc(
        surface.col * CELL + CELL / 2,
        row * CELL + 7,
        3.5,
        0,
        Math.PI * 2,
      );
      context.fill();
    });
  }

  function refresh(): void {
    draw();
    output.value = formatStructure(grid);
    const issues = structureIssues(grid);
    if (issues.length === 0) {
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
          textContent: `Crossable both ways. Exit raises the rest of the level by ${lift} tile${lift === 1 ? '' : 's'}.${
            strandedCount > 0
              ? ` (${strandedCount} platform${strandedCount === 1 ? '' : 's'} unreachable from the entry.)`
              : ''
          }`,
        }),
      );
    } else {
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
    }
  }

  let tool: number = BLOCK;
  let isPainting = false;
  let paintValue: number = BLOCK;

  function cellAt(event: PointerEvent): { row: number; column: number } | null {
    const rect = canvas.getBoundingClientRect();
    const column = floor(
      ((event.clientX - rect.left) / rect.width) * SECTOR_WIDTH,
    );
    const row = floor(
      ((event.clientY - rect.top) / rect.height) * STRUCTURE_HEIGHT,
    );
    if (
      column < 0 ||
      column >= SECTOR_WIDTH ||
      row < 0 ||
      row >= STRUCTURE_HEIGHT
    )
      return null;
    return { row, column };
  }

  function paint(row: number, column: number): void {
    if (grid[row][column] === paintValue) return;
    grid[row][column] = paintValue;
    refresh();
  }

  canvas.addEventListener('pointerdown', (event) => {
    const cell = cellAt(event);
    if (!cell) return;
    isPainting = true;
    paintValue = grid[cell.row][cell.column] === tool ? AIR : tool;
    canvas.setPointerCapture(event.pointerId);
    paint(cell.row, cell.column);
  });
  canvas.addEventListener('pointermove', (event) => {
    if (!isPainting) return;
    const cell = cellAt(event);
    if (cell) paint(cell.row, cell.column);
  });
  const stopPainting = () => {
    isPainting = false;
  };
  canvas.addEventListener('pointerup', stopPainting);
  canvas.addEventListener('pointercancel', stopPainting);

  function load(nextGrid: Structure): void {
    grid = clone(nextGrid);
    refresh();
  }

  async function copyOutput(): Promise<void> {
    try {
      await navigator.clipboard.writeText(output.value);
    } catch {
      output.select();
      document.execCommand('copy');
    }
    toast.textContent = 'Copied! Paste it into a pool in structures/library.ts';
    window.setTimeout(() => (toast.textContent = ''), 2500);
  }

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
    if (examplesSelect.value !== '' && examples[index])
      load(examples[index].grid);
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
    onclick: () => {
      const parsed = parseGrid(loader.value);
      if (parsed) {
        load(parsed);
        loader.value = '';
      } else {
        toast.textContent =
          "Couldn't read that — expected a grid of 0s and 1s.";
        window.setTimeout(() => (toast.textContent = ''), 2500);
      }
    },
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
          textContent:
            'Paint blocks to design a 20-wide level chunk. The bottom row is the ground line: solid = ground, gaps = bottomless pits, blocks floating above bridge them. Stack the right edge up to make the structure exit higher. Drop enemies with the Enemy tool — each needs a block directly beneath it to patrol on. Click or drag to paint; click a matching cell to clear it.',
        }),
      ),
      createElement('div', { className: 'layout' }, stage, side),
    ),
  );

  refresh();
}
