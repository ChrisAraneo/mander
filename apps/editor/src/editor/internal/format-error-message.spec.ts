import { describe, expect, it } from 'vitest';

import { formatErrorMessage } from './format-error-message';

describe('formatErrorMessage', () => {
  it('should give the message of the error when it is given an error', () => {
    expect(formatErrorMessage(new Error('the disk is full'))).toBe(
      'the disk is full',
    );
  });

  it('should give the value as text when it is given anything else', () => {
    expect(formatErrorMessage('offline')).toBe('offline');
    expect(formatErrorMessage(404)).toBe('404');
  });
});
