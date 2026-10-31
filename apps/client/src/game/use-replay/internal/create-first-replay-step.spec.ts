import type { GameLevel } from '@mander/engine';
import { type Tile, TILE_AIR } from '@mander/model';
import type { Palette } from '@mander/render';
import { constant, times } from 'lodash-es';
import { NEVER } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { ref } from 'vue';

import { createCanvasCell } from '../../canvas';
import type { RunRecord } from '../../storage';
import { createStartState } from '../create-start-state';
import type { ReplayStage } from '../types/replay-stage';
import { createFirstReplayStep } from './create-first-replay-step';

const LEVEL: GameLevel = {
  seed: 'RUN',
  width: 4,
  height: 4,
  tiles: times(4, (): Tile[] => times(4, constant(TILE_AIR))),
  chestItems: [],
  hornedEnemyChance: 0,
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
};

const RIVAL: RunRecord = {
  id: 'RUN-1',
  name: 'ABC',
  day: '2026-09-04',
  playedAt: '',
  outcome: 'GAME_OVER',
  score: 0,
  seconds: 0,
  levelIndex: 0,
  replay: { worldName: 'ABC', steps: 8, entries: [] },
};

const createStage = (rivals: RunRecord[], score: number): ReplayStage => ({
  cell: createCanvasCell(ref(null)),
  palette: {} as unknown as Palette,
  levels: [LEVEL],
  score,
  rivals,
  frames: NEVER,
});

describe('createFirstReplayStep', () => {
  it('should open the replay on the start of the world', () => {
    const { frame } = createFirstReplayStep(createStage([], 450));

    expect(frame.playback.step).toBe(0);
    expect(frame.playback.state).toEqual(createStartState([LEVEL], 450));
  });

  it('should bring one ghost for each rival run', () => {
    const { ghosts } = createFirstReplayStep(createStage([RIVAL, RIVAL], 0));

    expect(ghosts).toHaveLength(2);
    expect(ghosts[0].recording.steps).toBe(8);
  });

  it('should start with no part of a step drawn', () => {
    expect(createFirstReplayStep(createStage([], 0)).alpha).toBe(0);
  });

  it('should bring no ghosts when there are no rival runs', () => {
    expect(createFirstReplayStep(createStage([], 0)).ghosts).toEqual([]);
  });
});
