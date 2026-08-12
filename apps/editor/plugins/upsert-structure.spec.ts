import { describe, expect, it } from 'vitest';

import { readStructures } from './read-structures';
import { upsertStructure } from './upsert-structure';

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

export const NORMAL_01: Structure = ${TEXT};

export const NORMAL_02: Structure = ${OTHER};
`;

describe('upsertStructure', () => {
  it('should rewrite the structure that is already there', () => {
    const { source: written, created } = upsertStructure(
      source,
      'NORMAL_01',
      OTHER,
    );

    expect(created).toBe(false);
    expect(readStructures(written)).toEqual([
      { name: 'NORMAL_01', text: OTHER },
      { name: 'NORMAL_02', text: OTHER },
    ]);
  });

  it('should leave its neighbours untouched when it rewrites one', () => {
    const { source: written } = upsertStructure(source, 'NORMAL_02', TEXT);

    expect(written).toBe(
      `import { DR, __ } from './consts';
import type { Structure } from './structure';

export const NORMAL_01: Structure = ${TEXT};

export const NORMAL_02: Structure = ${TEXT};
`,
    );
  });

  it('should add a structure the file has never seen, after the last one', () => {
    const { source: written, created } = upsertStructure(
      source,
      'NORMAL_03',
      TEXT,
    );

    expect(created).toBe(true);
    expect(
      written.endsWith(`export const NORMAL_03: Structure = ${TEXT};\n`),
    ).toBe(true);
    expect(readStructures(written)).toHaveLength(3);
  });

  it('should keep one blank line between the structures it adds', () => {
    const once = upsertStructure(source, 'NORMAL_03', TEXT).source;
    const twice = upsertStructure(once, 'NORMAL_04', TEXT).source;

    expect(twice.includes('\n\n\n')).toBe(false);
    expect(readStructures(twice)).toHaveLength(4);
  });
});
