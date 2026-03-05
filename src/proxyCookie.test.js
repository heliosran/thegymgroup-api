import { describe, expect, it } from 'vitest';
import { extractJSessionCookie } from './proxyCookie';

describe('extractJSessionCookie', () => {
  it('returns only JSESSIONID when multiple cookies exist', () => {
    const cookie = 'foo=bar; JSESSIONID=abc123; theme=dark';
    expect(extractJSessionCookie(cookie)).toBe('JSESSIONID=abc123');
  });

  it('returns empty string when JSESSIONID is missing', () => {
    expect(extractJSessionCookie('foo=bar; theme=dark')).toBe('');
  });
});
