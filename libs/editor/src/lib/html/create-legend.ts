import { MAX_JUMP_TILES, PLAYER_HEIGHT_TILES } from '@mander/engine';
import { PLAYER_CLEARANCE } from '@mander/generator';

import { COLORS } from '../config/constants';
import { createHtmlElement } from './create-html-element';
import { createSwatch } from './create-swatch';

export const createLegend = (): HTMLDivElement =>
  createHtmlElement(
    'div',
    { className: 'legend' },
    createSwatch(COLORS.block, 'block (1)'),
    createSwatch(COLORS.enemy, 'enemy (2) — stands on the block below it'),
    createSwatch(COLORS.spike, 'spike (3) — sits on the block below it'),
    createSwatch(
      COLORS.spike,
      'ceiling spike (4) — hangs from the block above it',
    ),
    createSwatch(COLORS.pit, 'bottomless pit column'),
    createSwatch(COLORS.reachable, 'surface reachable from entry'),
    createSwatch(COLORS.stranded, 'surface stranded'),
    createSwatch(
      COLORS.cramped,
      `less than ${PLAYER_CLEARANCE} cells of headroom`,
    ),
    createSwatch(
      COLORS.player,
      `the player — ${PLAYER_HEIGHT_TILES} cells tall, climbs ${MAX_JUMP_TILES - 1} cells`,
    ),
    createHtmlElement(
      'span',
      {},
      'gold line = ground level (enters flush on the left, exits on the right)',
    ),
  );
