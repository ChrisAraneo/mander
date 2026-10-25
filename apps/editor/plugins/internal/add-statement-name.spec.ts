import { describe, expect, it } from 'vitest';

import { addStatementName } from './add-statement-name.ts';

const PATTERN = /import \{([^}]*?)\} from '\.\/normal';/;

const SOURCE = "import { NORMAL_001 } from './normal';\n";

describe('addStatementName', () => {
  it('should add the name to the list of the statement when the list does not have it', () => {
    expect(addStatementName(SOURCE, PATTERN, 'NORMAL_002')).toBe(
      "import { NORMAL_001, NORMAL_002 } from './normal';\n",
    );
  });

  it('should give the same source back when the list already has the name', () => {
    expect(addStatementName(SOURCE, PATTERN, 'NORMAL_001')).toBe(SOURCE);
  });

  it('should give the same source back when the source has no such statement', () => {
    expect(addStatementName('', PATTERN, 'NORMAL_002')).toBe('');
  });
});
