import { describe, expect, it } from 'vitest';

import { registerStructure } from './register-structure';

const library = `import { HARD_01 } from './hard';
import {
  NORMAL_01,
  NORMAL_02,
} from './normal';
import type { Structure } from './structure';

export const HARD_STRUCTURES: readonly Structure[] = Object.freeze([
  HARD_01,
]);

export const NORMAL_STRUCTURES: readonly Structure[] = Object.freeze([
  NORMAL_01,
  NORMAL_02,
]);
`;

describe('registerStructure', () => {
  it('should import a new structure and deal it into its own pool', () => {
    const written = registerStructure(library, 'NORMAL_03', 'normal');

    expect(written).toContain("  NORMAL_03,\n} from './normal';");
    expect(written).toContain('  NORMAL_02,\n  NORMAL_03,\n]);');
    expect(written).not.toContain(
      'HARD_STRUCTURES: readonly Structure[] = Object.freeze([\n  HARD_01,\n  NORMAL_03,',
    );
  });

  it('should reach the hard pool through the hard file', () => {
    const written = registerStructure(library, 'HARD_02', 'hard');

    expect(written).toContain("import { HARD_01, HARD_02 } from './hard';");
    expect(written).toContain('  HARD_01,\n  HARD_02,\n]);');
  });

  it('should change nothing when the structure is already dealt', () => {
    expect(registerStructure(library, 'NORMAL_02', 'normal')).toBe(library);
  });

  it('should deal a structure that is imported but commented out of the pool', () => {
    const parked = library.replace('  NORMAL_02,\n]);', '  // NORMAL_02,\n]);');
    const written = registerStructure(parked, 'NORMAL_02', 'normal');

    expect(written).toContain('  // NORMAL_02,\n  NORMAL_02,\n]);');
  });
});
