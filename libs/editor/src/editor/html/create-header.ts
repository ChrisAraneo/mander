import {
  MAX_JUMP_TILES,
  PLAYER_CLEARANCE,
  PLAYER_HEIGHT_TILES,
} from '@mander/generator';

import { createHtmlElement } from './create-html-element';

export const createHeader = (): HTMLElement =>
  createHtmlElement(
    'header',
    {},
    createHtmlElement('h1', { textContent: 'Mander Structure Editor' }),
    createHtmlElement('p', {
      textContent: `Paint blocks to design a 20-wide level chunk. The bottom row is the ground line: solid = ground, gaps = bottomless pits, blocks floating above bridge them. Stack the right edge up to make the structure exit higher. Drop enemies with the Enemy tool — each needs a block directly beneath it to patrol on. Add hazards with the Spike tool (sits on the block below) or the Ceiling spike tool (hangs from the block above) — ceiling spikes exist only where you place them here. Click or drag to paint; click a matching cell to clear it. The player is ${PLAYER_HEIGHT_TILES} cells tall, so every surface needs ${PLAYER_CLEARANCE} clear cells above it, and a jump climbs at most ${MAX_JUMP_TILES - 1} cells.`,
    }),
  );
