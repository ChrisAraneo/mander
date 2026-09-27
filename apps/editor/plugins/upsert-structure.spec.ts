import { describe, expect, it } from 'vitest';

import { readStructures } from './read-structures.ts';
import { upsertStructure } from './upsert-structure.ts';

const TEXT = `[
  [__, DR],
  [DR, DR],
]`;

const OTHER = `[
  [DR, __],
  [DR, DR],
]`;

const source = `import { DR, __ } from './consts';
import type { Structure } from './structure';

export const NORMAL_001: Structure = ${TEXT};

export const NORMAL_002: Structure = ${OTHER};
`;

describe('upsertStructure', () => {
  it('should rewrite the structure when it is already there', () => {
    const { source: written, isCreated } = upsertStructure(
      source,
      'NORMAL_001',
      OTHER,
    );

    expect(isCreated).toBe(false);
    expect(readStructures(written)).toEqual([
      { name: 'NORMAL_001', text: OTHER },
      { name: 'NORMAL_002', text: OTHER },
    ]);
  });

  it('should leave its neighbours untouched when it rewrites one', () => {
    const { source: written } = upsertStructure(source, 'NORMAL_002', TEXT);

    expect(written).toBe(
      `import { DR, __ } from './consts';
import type { Structure } from './structure';

export const NORMAL_001: Structure = ${TEXT};

export const NORMAL_002: Structure = ${TEXT};
`,
    );
  });

  it('should add the structure after the last one when the file has never seen it', () => {
    const { source: written, isCreated } = upsertStructure(
      source,
      'NORMAL_003',
      TEXT,
    );

    expect(isCreated).toBe(true);
    expect(
      written.endsWith(`export const NORMAL_003: Structure = ${TEXT};\n`),
    ).toBe(true);
    expect(readStructures(written)).toHaveLength(3);
  });

  it('should keep one blank line between the structures when it adds a second one', () => {
    const once = upsertStructure(source, 'NORMAL_003', TEXT).source;
    const twice = upsertStructure(once, 'NORMAL_004', TEXT).source;

    expect(twice.includes('\n\n\n')).toBe(false);
    expect(readStructures(twice)).toHaveLength(4);
  });
});
