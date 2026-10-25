import { createInitialState, type GameLevel } from '@mander/engine';
import { type Tile, TILE_AIR } from '@mander/model';
import type { Palette } from '@mander/render';
import { constant, times } from 'lodash-es';
import { Subject } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { ref, shallowRef } from 'vue';

import { createCanvasCell } from '../../canvas';
import type { AnimationFrame } from '../../tick';
import type { Backdrop } from '../types/backdrop';
import { closeBackdrop } from './close-backdrop';
import { createBackdropStartFrame } from './create-backdrop-start-frame';
import { startBackdrop } from './start-backdrop';

const LEVEL: GameLevel = {
  seed: 'RUN',
  width: 4,
  height: 4,
  tiles: times(4, (): Tile[] => times(4, constant(TILE_AIR))),
  chestItems: [],
  hornedEnemyChance: 0,
};

const CONTEXT = { kind: 'CONTEXT' } as unknown as CanvasRenderingContext2D;

const CANVAS = {
  getContext: () => CONTEXT,
} as unknown as HTMLCanvasElement;

const createBackdropFixture = (canvas: HTMLCanvasElement | null): Backdrop => ({
  cell: createCanvasCell(ref(canvas)),
  palette: {} as unknown as Palette,
  focus: { x: 0, y: 0 },
  idle: createInitialState(LEVEL, 0, []),
  frame: shallowRef(createBackdropStartFrame(createInitialState(LEVEL, 0, []))),
  subscription: shallowRef(null),
});

describe('closeBackdrop', () => {
  it('should stop watching the frames when it closes the backdrop', () => {
    const backdrop = createBackdropFixture(CANVAS);
    const frames = new Subject<AnimationFrame>();
    startBackdrop(backdrop, frames);

    closeBackdrop(backdrop);

    expect(backdrop.subscription.value?.closed).toBe(true);
    expect(frames.observed).toBe(false);
  });

  it('should let go of the drawing context when it closes the backdrop', () => {
    const backdrop = createBackdropFixture(CANVAS);
    startBackdrop(backdrop, new Subject<AnimationFrame>());

    expect(closeBackdrop(backdrop)).toBeNull();
    expect(backdrop.cell.context.value).toBeNull();
  });

  it('should do nothing harmful when the backdrop was never started', () => {
    const backdrop = createBackdropFixture(null);

    expect(closeBackdrop(backdrop)).toBeNull();
    expect(backdrop.subscription.value).toBeNull();
  });
});
