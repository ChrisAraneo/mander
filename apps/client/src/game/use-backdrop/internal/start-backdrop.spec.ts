import { createInitialState, type GameLevel } from '@mander/engine';
import { type Tile, TILE_AIR } from '@mander/model';
import type { Palette } from '@mander/render';
import { constant, times } from 'lodash-es';
import { NEVER, Subject } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { ref, shallowRef } from 'vue';

import { createCanvasCell } from '../../canvas';
import type { AnimationFrame } from '../../tick';
import type { Backdrop } from '../types/backdrop';
import { createBackdropStartFrame } from './create-backdrop-start-frame';
import { startBackdrop } from './start-backdrop';

const LEVEL: GameLevel = {
  seed: 'RUN',
  width: 4,
  height: 4,
  tiles: times(4, (): Tile[] => times(4, constant(TILE_AIR))),
  chestItems: [],
  hornedEnemyChance: 0,
  shooterEnemyChance: 0,
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

describe('startBackdrop', () => {
  it('should start watching the frames when the canvas is mounted', () => {
    const backdrop = createBackdropFixture(CANVAS);
    const frames = new Subject<AnimationFrame>();

    const subscription = startBackdrop(backdrop, frames);

    expect(backdrop.subscription.value).toBe(subscription);
    expect(frames.observed).toBe(true);
    subscription?.unsubscribe();
  });

  it('should keep the drawing context when the canvas is mounted', () => {
    const backdrop = createBackdropFixture(CANVAS);

    const subscription = startBackdrop(backdrop, NEVER);

    expect(backdrop.cell.context.value).toBe(CONTEXT);
    subscription?.unsubscribe();
  });

  it('should start nothing when the canvas is not mounted', () => {
    const backdrop = createBackdropFixture(null);
    const frames = new Subject<AnimationFrame>();

    expect(startBackdrop(backdrop, frames)).toBeNull();
    expect(backdrop.subscription.value).toBeNull();
    expect(frames.observed).toBe(false);
  });
});
