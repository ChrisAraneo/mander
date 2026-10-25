import { map, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { PLAYED_WORLDS_KEPT } from '../consts';
import type { PlayedWorld } from '../types/played-world';
import type { SaveData } from '../types/save-data';
import { addPlayedWorld } from './add-played-world';

const createSave = (playedWorlds: PlayedWorld[]): SaveData => ({
  score: 0,
  completedWorlds: [],
  playedWorlds,
  runs: [],
});

describe('addPlayedWorld', () => {
  it('should remember the world when it is played for the first time', () => {
    expect(
      addPlayedWorld(createSave([]), { name: 'ABC', day: '2026-08-16' }, 'NOW')
        .playedWorlds,
    ).toEqual([{ name: 'ABC', day: '2026-08-16', playedAt: 'NOW', runs: 1 }]);
  });

  it('should count one more run and move the world to the end when it is played again', () => {
    const save = createSave([
      { name: 'ABC', day: '2026-08-16', playedAt: 'THEN', runs: 2 },
      { name: 'XYZ', day: '2026-08-17', playedAt: 'THEN', runs: 1 },
    ]);

    expect(
      addPlayedWorld(save, { name: 'ABC', day: '2026-08-16' }, 'NOW')
        .playedWorlds,
    ).toEqual([
      { name: 'XYZ', day: '2026-08-17', playedAt: 'THEN', runs: 1 },
      { name: 'ABC', day: '2026-08-16', playedAt: 'NOW', runs: 3 },
    ]);
  });

  it('should let go of the oldest world when the shelf is full', () => {
    const save = createSave(
      times(PLAYED_WORLDS_KEPT, (index) => ({
        name: `W${index}`,
        day: '',
        playedAt: '',
        runs: 1,
      })),
    );

    const { playedWorlds } = addPlayedWorld(
      save,
      { name: 'NEW', day: '' },
      'NOW',
    );

    expect(playedWorlds).toHaveLength(PLAYED_WORLDS_KEPT);
    expect(map(playedWorlds, (world) => world.name)[0]).toBe('W1');
  });

  it('should not change the old save when it remembers a world', () => {
    const save = createSave([]);

    addPlayedWorld(save, { name: 'ABC', day: '2026-08-16' }, 'NOW');

    expect(save).toEqual(createSave([]));
  });
});
