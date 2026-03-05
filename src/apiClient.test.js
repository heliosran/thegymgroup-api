import { describe, expect, it, vi } from 'vitest';
import { allEndpoints } from './data/endpoints';
import { buildRequest, callEndpoint } from './apiClient';

describe('endpoint coverage', () => {
  it('contains all documented endpoints as executable definitions', () => {
    expect(allEndpoints.length).toBe(83);
    const keys = new Set(allEndpoints.map((item) => item.key));
    expect(keys.size).toBe(allEndpoints.length);
  });

  it('builds class booking request with path/query/form and browser-safe options', () => {
    const endpoint = allEndpoints.find((item) => item.key === 'addExerciser');
    const { url, options } = buildRequest('', endpoint, {
      companyUuid: 'club-1',
      classUuid: 'class-1',
      exerciserUuid: 'user-1',
      spot: '3'
    });

    expect(url).toContain('/np/company/club-1/class/class-1/addExerciser');
    expect(options.credentials).toBe('include');
    expect(options.body.toString()).toContain('spot=3');
    expect(options.headers['User-Agent']).toBeUndefined();
    expect(options.headers.Cookie).toBeUndefined();
  });

  it('preserves falsy JSON values instead of coercing to empty strings', () => {
    const endpoint = allEndpoints.find((item) => item.key === 'egymOptInsSet');
    const { options } = buildRequest('', endpoint, {
      exerciserUuid: 'user-1',
      marketing: false,
      thirdParty: false
    });

    expect(options.headers['Content-Type']).toBe('application/json');
    expect(options.body).toBe('{"marketing":false,"thirdParty":false}');
  });

  it('does not throw on non-JSON responses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => 'plain-text' }));
    const result = await callEndpoint({ baseUrl: '', endpointKey: 'challengePrizeImage', values: { challengeId: 'abc' } });
    expect(result.ok).toBe(true);
    expect(result.data).toEqual({ raw: 'plain-text' });
    vi.unstubAllGlobals();
  });
});
