import { allEndpoints } from './data/endpoints';

const endpointMap = Object.fromEntries(allEndpoints.map((endpoint) => [endpoint.key, endpoint]));

export function buildRequest(baseUrl, endpoint, values = {}, token) {
  let path = endpoint.path;
  for (const param of endpoint.pathParams || []) {
    path = path.replace(`{${param}}`, encodeURIComponent(values[param] || ''));
  }

  const query = new URLSearchParams();
  for (const param of endpoint.query || []) {
    if (values[param]) query.set(param, values[param]);
  }

  const url = `${baseUrl}${path}${query.toString() ? `?${query}` : ''}`;
  const headers = {
    Accept: 'application/json',
    'X-NP-API-Version': '1.5',
    'X-NP-APP-Version': values.appVersion || '9999',
    'User-Agent': 'okhttp/3.12.3',
    'X-NP-User-Agent': values.npUserAgent || 'clientType=MOBILE_DEVICE; devicePlatform=ANDROID; applicationName=The Gym Group; applicationVersion=5.0; applicationVersionCode=38'
  };
  if (token) headers.Cookie = token;

  const options = { method: endpoint.method, headers };

  if (endpoint.form?.length) {
    options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    const body = new URLSearchParams();
    endpoint.form.forEach((field) => body.set(field, values[field] || ''));
    options.body = body;
  }

  if (endpoint.json?.length) {
    options.headers['Content-Type'] = 'application/json';
    const payload = Object.fromEntries(endpoint.json.map((field) => [field, values[field] || '']));
    options.body = JSON.stringify(payload);
  }

  return { url, options };
}

export async function callEndpoint({ baseUrl, endpointKey, values, token }) {
  const endpoint = endpointMap[endpointKey];
  if (!endpoint) {
    throw new Error(`Unknown endpoint key: ${endpointKey}`);
  }

  const request = buildRequest(baseUrl, endpoint, values, token);
  const response = await fetch(request.url, request.options);
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  return { ok: response.ok, status: response.status, data, request };
}
