import { describe, expect, it } from 'vitest';

import { getEnemyPalette } from './get-enemy-palette';

describe('getEnemyPalette', () => {
  it('should give the green palette when the enemy hops', () => {
    const result = getEnemyPalette('HOPPING');

    expect(result).toEqual({
      feet: '#2A7D2A',
      body: '#3FB53F',
      belly: '#5FD55F',
      brow: '#123A12',
    });
  });

  it('should give the red palette when the enemy has horns', () => {
    const result = getEnemyPalette('HORNED');

    expect(result).toEqual({
      feet: '#7D2F2A',
      body: '#B5473F',
      belly: '#D5695F',
      brow: '#3A1512',
    });
  });

  it('should give the yellow palette when the enemy is fast', () => {
    const result = getEnemyPalette('FAST');

    expect(result).toEqual({
      feet: '#A8861E',
      body: '#E0BC2C',
      belly: '#FFE06F',
      brow: '#4A3A0C',
    });
  });

  it('should give the gray palette when the enemy shoots', () => {
    const result = getEnemyPalette('SHOOTER');

    expect(result).toEqual({
      feet: '#4A4A4A',
      body: '#8A8A8A',
      belly: '#B8B8B8',
      brow: '#232323',
    });
  });

  it('should give the blue palette when the enemy flies', () => {
    const result = getEnemyPalette('FLYING');

    expect(result).toEqual({
      feet: '#1E5FA8',
      body: '#3C8DE0',
      belly: '#7FC3FF',
      brow: '#123A6B',
    });
  });

  it('should give the green palette when the enemy is a beartrap', () => {
    const result = getEnemyPalette('BEARTRAP');

    expect(result).toEqual({
      feet: '#2A7D2A',
      body: '#3FB53F',
      belly: '#5FD55F',
      brow: '#123A12',
    });
  });
});
