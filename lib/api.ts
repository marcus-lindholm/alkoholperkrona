/**
 * Returns the base URL for API calls.
 * - Web: empty string (relative URLs like /api/products)
 * - Capacitor: full production URL (https://www.apkrona.se)
 */
export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || '';
}
