import { allEndpoints } from './data/endpoints';

const endpointMap = Object.fromEntries(allEndpoints.map((endpoint) => [endpoint.key, endpoint]));

export function buildRequest(baseUrl, endpoint, values = {}) {
  let path = endpoint.path;
  for (const param of endpoint.pathParams || []) {
    path = path.replace(`{${param}}`, encodeURIComponent(String(values[param] ?? '')));
  }

  const query = new URLSearchParams();
  for (const param of endpoint.query || []) {
    if (values[param] !== undefined && values[param] !== null) query.set(param, String(values[param]));
  }

  const url = `${baseUrl}${path}${query.toString() ? `?${query}` : ''}`;
  const headers = {
    Accept: 'application/json',
    'X-NP-API-Version': '1.5',
    'X-NP-APP-Version': values.appVersion ?? '9999',
    'X-NP-User-Agent': values.npUserAgent ?? 'clientType=MOBILE_DEVICE; devicePlatform=ANDROID; applicationName=The Gym Group; applicationVersion=5.0; applicationVersionCode=38'
  };

  // Browser sends cookies to local dev server; proxy forwards only JSESSIONID upstream.
  const options = { method: endpoint.method, headers, credentials: 'include' };

  if (endpoint.form?.length) {
    options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    const body = new URLSearchParams();
    endpoint.form.forEach((field) => body.set(field, String(values[field] ?? '')));
    options.body = body;
  }

  if (endpoint.json?.length) {
    options.headers['Content-Type'] = 'application/json';
    const payload = Object.fromEntries(endpoint.json.map((field) => [field, values[field] ?? '']));
    options.body = JSON.stringify(payload);
  }

  return { url, options };
}

export async function callEndpoint({ baseUrl, endpointKey, values }) {
  const endpoint = endpointMap[endpointKey];
  if (!endpoint) {
    throw new Error(`Unknown endpoint key: ${endpointKey}`);
  }

  const request = buildRequest(baseUrl, endpoint, values);
  const response = await fetch(request.url, request.options);
  const text = await response.text();
  let data = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
  }
  return { ok: response.ok, status: response.status, data, request };
}
