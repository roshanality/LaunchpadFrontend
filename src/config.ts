// API Configuration
// In development we default to the local Flask server.
// In production we prefer same-origin requests so deployments can proxy
// `/api/*` to the backend without baking a host into the frontend bundle.
const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

export const API_BASE_URL =
  rawApiBaseUrl && rawApiBaseUrl !== '/'
    ? rawApiBaseUrl.replace(/\/+$/, '')
    : import.meta.env.DEV
      ? 'http://localhost:5001'
      : ''

// Helper function to construct API URLs
export const getApiUrl = (path: string): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return API_BASE_URL ? `${API_BASE_URL}${normalizedPath}` : normalizedPath
}
