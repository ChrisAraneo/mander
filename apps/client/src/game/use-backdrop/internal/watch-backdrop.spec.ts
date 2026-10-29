import { createInitialState, type GameLevel } from '@mander/engine';
import { type Tile, TILE_AIR } from '@mander/model';
import type { Palette } from '@mander/render';
import { constant, times } from 'lodash-es';
import { Subject } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { ref, shallowRef } from 'vue';

import { createCanvasCell } from '../../canvas';
import type { Pulse } from '../../tick';
import type { Backdrop } from '../types/backdrop';
import { createBackdropStartFrame } from './create-backdrop-start-frame';
import { watchBackdrop } from './watch-backdrop';

const LEVEL: GameLevel = {
  seed: 'RUN',
  width: 4,
  height: 4,
  tiles: times(4, (): Tile[] => times(4, constant(TILE_AIR))),
  chestItems: [],
  hornedEnemyChance: 0,
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
};

const createBackdropFixture = (): Backdrop => ({
  cell: createCanvasCell(ref(null)),
  palette: {} as unknown as Palette,
  focus: { x: 0, y: 0 },
  idle: createInitialState(LEVEL, 0, []),
  frame: shallowRef(createBackdropStartFrame(createInitialState(LEVEL, 0, []))),
  subscription: shallowRef(null),
});

describe('watchBackdrop', () => {
  it('should move the scene on when a pulse brings a step', () => {
    const backdrop = createBackdropFixture();
    const pulses = new Subject<Pulse>();
    const subscription = watchBackdrop(backdrop, pulses);

    pulses.next({ steps: 1, alpha: 0 });

    expect(backdrop.frame.value.previous).toBe(backdrop.idle);
    expect(backdrop.frame.value.current.time).toBeGreaterThan(
      backdrop.idle.time,
    );
    subscription.unsubscribe();
  });

  it('should keep the scene when the pulse brings no step', () => {
    const backdrop = createBackdropFixture();
    const frame = backdrop.frame.value;
    const pulses = new Subject<Pulse>();
    const subscription = watchBackdrop(backdrop, pulses);

    pulses.next({ steps: 0, alpha: 0.5 });

    expect(backdrop.frame.value).toBe(frame);
    subscription.unsubscribe();
  });

  it('should keep the scene when no pulse comes', () => {
    const backdrop = createBackdropFixture();
    const frame = backdrop.frame.value;

    const subscription = watchBackdrop(backdrop, new Subject<Pulse>());

    expect(backdrop.frame.value).toBe(frame);
    subscription.unsubscribe();
  });

  it('should stop moving the scene when the watch is closed', () => {
    const backdrop = createBackdropFixture();
    const frame = backdrop.frame.value;
    const pulses = new Subject<Pulse>();
    watchBackdrop(backdrop, pulses).unsubscribe();

    pulses.next({ steps: 1, alpha: 0 });

    expect(backdrop.frame.value).toBe(frame);
    expect(pulses.observed).toBe(false);
  });
});
