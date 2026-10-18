import type { Player } from '@mander/model';
import { assign, filter, head, map, size, split, startsWith } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { drawGhost } from './draw-ghost';
import { drawPlayer } from './draw-player';

const createTestPlayer = (patch: Partial<Player['timers']> = {}): Player => ({
  position: { x: 64, y: 96 },
  velocity: { x: { current: 0, max: 220 }, y: { current: 0, max: 400 } },
  hearts: { value: 3 },
  timers: assign({ death: null, invincibility: 0, star: 0, hurt: 0 }, patch),
  statuses: { isFacingRight: true, isGrounded: true, isJumpQueued: false },
});

const drawGhostCalls = (patch: Partial<Player['timers']> = {}): string[] =>
  drawRecorded((context) =>
    drawGhost(context, { player: createTestPlayer(patch), time: 0 }),
  );

const drawPlayerCalls = (patch: Partial<Player['timers']> = {}): string[] =>
  drawRecorded((context) => drawPlayer(context, createTestPlayer(patch), 0));

const toCallNames = (calls: string[]): string[] =>
  map(calls, (call) => head(split(call, '(')) ?? '');

const countCalls = (calls: string[], name: string): number =>
  size(filter(calls, (call) => startsWith(call, `${name}(`)));

describe('drawGhost', () => {
  it('should draw the same figure the player is drawn with when it draws a ghost', () => {
    expect(toCallNames(drawGhostCalls())).toEqual(
      toCallNames(drawPlayerCalls()),
    );
  });

  it('should draw the ghost the same way as any other when it is starlit', () => {
    expect(toCallNames(drawGhostCalls({ star: 5 }))).toEqual(
      toCallNames(drawGhostCalls()),
    );
  });

  it('should hand the canvas back as it found it when it draws a ghost', () => {
    const calls = drawGhostCalls({ star: 5 });

    expect(size(calls)).toBeGreaterThan(0);
    expect(countCalls(calls, 'save')).toBe(countCalls(calls, 'restore'));
  });
});
