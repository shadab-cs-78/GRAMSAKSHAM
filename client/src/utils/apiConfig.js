/**
 * Dynamic API Base URL Configurator
 * Resolves API URL seamlessly for:
 * 1. Localhost (http://localhost:5000/api)
 * 2. Local Wi-Fi LAN IP (e.g., http://10.48.130.60:5000/api for mobile testing)
 * 3. Vercel Serverless Production (/api)
 */

export function getApiBaseUrl() {
  // If Vite env variable is explicitly provided, prioritize it
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // If in browser
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;

    // Running on Vercel or public domain
    if (hostname.includes('vercel.app') || (!hostname.includes('localhost') && !hostname.startsWith('10.') && !hostname.startsWith('192.') && !hostname.startsWith('127.'))) {
      return '/api';
    }

    // Running locally or over LAN Wi-Fi
    return `${protocol}//${hostname}:5000/api`;
  }

  return 'http://localhost:5000/api';
}
