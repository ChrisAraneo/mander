import { describe, expect, it } from 'vitest';

import { registerStructure } from './register-structure.ts';

const library = `import { values } from 'lodash-es';

import { HARD_001 } from './hard';
import {
  NORMAL_001,
  NORMAL_002,
} from './normal';
import type { Structure } from './structure';

export const HARD_LIBRARY = Object.freeze({
  HARD_001,
});

export const HARD_STRUCTURES: readonly Structure[] = Object.freeze(
  values(HARD_LIBRARY),
);

export const NORMAL_LIBRARY = Object.freeze({
  NORMAL_001,
  NORMAL_002,
});

export const NORMAL_STRUCTURES: readonly Structure[] = Object.freeze(
  values(NORMAL_LIBRARY),
);
`;

describe('registerStructure', () => {
  it('should import a new structure and deal it into its own pool', () => {
    const written = registerStructure(library, 'NORMAL_003', 'normal');

    expect(written).toContain("  NORMAL_003,\n} from './normal';");
    expect(written).toContain('  NORMAL_002,\n  NORMAL_003,\n});');
    expect(written).not.toContain('  HARD_001,\n  NORMAL_003,\n});');
  });

  it('should reach the hard pool through the hard file', () => {
    const written = registerStructure(library, 'HARD_002', 'hard');

    expect(written).toContain("import { HARD_001, HARD_002 } from './hard';");
    expect(written).toContain('  HARD_001,\n  HARD_002,\n});');
  });

  it('should change nothing when the structure is already dealt', () => {
    expect(registerStructure(library, 'NORMAL_002', 'normal')).toBe(library);
  });

  it('should read only its own import, not the ones above it', () => {
    expect(registerStructure(library, 'NORMAL_001', 'normal')).toBe(library);
  });

  it('should deal a structure that is imported but commented out of the pool', () => {
    const parked = library.replace(
      '  NORMAL_002,\n});',
      '  // NORMAL_002,\n});',
    );
    const written = registerStructure(parked, 'NORMAL_002', 'normal');

    expect(written).toContain('  // NORMAL_002,\n  NORMAL_002,\n});');
  });
});
