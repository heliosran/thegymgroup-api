export function extractJSessionCookie(cookieHeader = '') {
  const match = String(cookieHeader)
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('JSESSIONID='));

  return match || '';
}
