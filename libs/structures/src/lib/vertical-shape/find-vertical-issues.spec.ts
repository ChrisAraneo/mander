import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { getFront } from '../get-front';
import { VERTICAL_STRUCTURES } from '../library';
import { findVerticalIssues } from './find-vertical-issues';

describe('findVerticalIssues', () => {
  it('should find no issues when the structure has the vertical shape', () => {
    expect(findVerticalIssues(getFront(VERTICAL_STRUCTURES[0]))).toEqual([]);
  });

  it('should find the marker and platform issues when the structure is empty', () => {
    expect(findVerticalIssues([])).toEqual([
      'the end must be marked in row 0, column 9, where the sector above is entered',
      'the start must be marked in row 21, column 9, where the sector below ends',
      'row 1 must carry a platform of at least 1 block from column 9, the ledge the player leaves from',
      'row 18 must carry the ledge the player lands on across columns 3-6 or 13-16, clear of rows 16 and 17',
    ]);
  });

  it('should give one message per issue when the structure breaks several rules', () => {
    expect(size(findVerticalIssues([]))).toBe(4);
  });
});
