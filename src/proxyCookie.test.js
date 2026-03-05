import { describe, expect, test } from 'bun:test';
import { extractJSessionCookie } from './proxyCookie';

describe('extractJSessionCookie', () => {
  test('returns only JSESSIONID when multiple cookies exist', () => {
    const cookie = 'foo=bar; JSESSIONID=abc123; theme=dark';
    expect(extractJSessionCookie(cookie)).toBe('JSESSIONID=abc123');
  });

  test('returns empty string when JSESSIONID is missing', () => {
    expect(extractJSessionCookie('foo=bar; theme=dark')).toBe('');
  });
});
