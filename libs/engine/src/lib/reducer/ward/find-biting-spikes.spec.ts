import { BOOTS_OF_CLOUDS, HEART, TITANIUM_HELMET } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { findBitingSpikes } from './find-biting-spikes';

describe('findBitingSpikes', () => {
  it('should find floor and ceiling spikes biting when the player has no wards', () => {
    const spikes = findBitingSpikes([HEART]);

    expect(spikes).toEqual(['FLOOR', 'CEILING']);
  });

  it('should find floor and ceiling spikes biting when the inventory is empty', () => {
    const spikes = findBitingSpikes([]);

    expect(spikes).toEqual(['FLOOR', 'CEILING']);
  });

  it('should find only ceiling spikes biting when the player wears the boots of clouds', () => {
    const spikes = findBitingSpikes([BOOTS_OF_CLOUDS]);

    expect(spikes).toEqual(['CEILING']);
  });

  it('should find only floor spikes biting when the player wears the titanium helmet', () => {
    const spikes = findBitingSpikes([TITANIUM_HELMET]);

    expect(spikes).toEqual(['FLOOR']);
  });

  it('should find no spikes biting when the player wears both the boots and the helmet', () => {
    const spikes = findBitingSpikes([BOOTS_OF_CLOUDS, TITANIUM_HELMET]);

    expect(spikes).toEqual([]);
  });
});
