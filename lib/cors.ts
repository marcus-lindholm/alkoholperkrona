import { NextApiRequest, NextApiResponse } from 'next';

/**
 * List of allowed origins for CORS.
 * Includes Capacitor origins for iOS and Android.
 */
const ALLOWED_ORIGINS = [
  'https://www.apkrona.se',
  'https://apkrona.se',
  'capacitor://localhost',  // iOS Capacitor
  'https://localhost',      // Android Capacitor (default in Capacitor 8+)
  'http://localhost',       // Android Capacitor (legacy/fallback)
];

/**
 * Sets CORS headers on the response to allow requests from the mobile app.
 * Call this at the start of every API handler.
 */
export function setCorsHeaders(req: NextApiRequest, res: NextApiResponse): boolean {
  const origin = req.headers.origin;

  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true; // Signal that the request was handled
  }

  return false;
}
