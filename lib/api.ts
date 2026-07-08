/**
 * Returns the base URL for API calls.
 * - Web: empty string (relative URLs like /api/products)
 * - Capacitor: full production URL (https://www.apkrona.se)
 */
export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || '';
}

/**
 * Systembolaget's apex domain (systembolaget.se) serves a TLS certificate that
 * isn't valid for that host, so links to it fail with ERR_CERT_AUTHORITY_INVALID.
 * Only www.systembolaget.se is valid (it then 308-redirects to the product page).
 * Normalize any stored product URL to https + www so links always work, regardless
 * of what format is in the database.
 */
export function productUrl(url: string | null | undefined): string {
  if (!url) return '#';
  return url.replace(/^https?:\/\/(?:www\.)?systembolaget\.se/i, 'https://www.systembolaget.se');
}
