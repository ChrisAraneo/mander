import { describe, expect, it } from 'vitest';

import { createImportPattern } from './create-import-pattern.ts';

describe('createImportPattern', () => {
  it('should find the names imported from the pool file when the library imports them', () => {
    const found = createImportPattern('normal').exec(
      "import { HARD_001 } from './hard';\nimport { NORMAL_001, NORMAL_002 } from './normal';",
    );

    expect(found?.[0]).toBe(
      "import { NORMAL_001, NORMAL_002 } from './normal';",
    );
    expect(found?.[1]).toBe(' NORMAL_001, NORMAL_002 ');
  });

  it('should find nothing when the library imports nothing from the pool file', () => {
    expect(
      createImportPattern('vertical').exec(
        "import { HARD_001 } from './hard';",
      ),
    ).toBeNull();
  });
});
