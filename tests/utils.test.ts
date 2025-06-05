import { cn } from '../src/lib/utils';

describe('cn', () => {
  test('merges class names', () => {
    expect(cn('a', { b: true, c: false }, 'd')).toBe('a b d');
  });
});
