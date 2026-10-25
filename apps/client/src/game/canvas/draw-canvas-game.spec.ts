import type { GameState } from '@mander/engine';
import type { Palette } from '@mander/render';
import { describe, expect, it } from 'vitest';
import { ref } from 'vue';

import { createCanvasCell } from './create-canvas-cell';
import { drawCanvasGame } from './draw-canvas-game';

const STATE = {} as unknown as GameState;

const PALETTE = {} as unknown as Palette;

const FOCUS = { x: 0, y: 0 };

describe('drawCanvasGame', () => {
  it('should leave the canvas alone when it has no drawing context yet', () => {
    const canvas = {} as unknown as HTMLCanvasElement;

    drawCanvasGame(createCanvasCell(ref(canvas)), STATE, PALETTE, FOCUS, []);

    expect(canvas).toEqual({});
  });

  it('should draw nothing when the canvas is not mounted', () => {
    expect(
      drawCanvasGame(createCanvasCell(ref(null)), STATE, PALETTE, FOCUS, []),
    ).toBeUndefined();
  });
});
