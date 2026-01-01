
/**
 * Fetch Helper Utilities
 * 
 * This module provides helper functions for making HTTP requests using
 * native fetch. It's designed to replace axios and other adapter-based
 * HTTP clients that cause the (h.adapter || o.adapter) error.
 * 
 * BUILD 142: Adapter Error Elimination
 */

export interface FetchOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

/**
 * Enhanced fetch with timeout support
 */
export async function fetchWithTimeout(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { timeout = 10000, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  }
}

/**
 * Fetch with automatic retries
 */
export async function fetchWithRetry(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { retries = 3, retryDelay = 1000, ...fetchOptions } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, fetchOptions);
      
      // Don't retry on successful responses or client errors (4xx)
      if (response.ok || (response.status >= 400 && response.status < 500)) {
        return response;
      }

      // Server error (5xx) - retry
      lastError = new Error(`Server error: ${response.status} ${response.statusText}`);
      
      if (attempt < retries) {
        console.log(`[fetchWithRetry] Attempt ${attempt + 1} failed, retrying in ${retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      if (attempt < retries) {
        console.log(`[fetchWithRetry] Attempt ${attempt + 1} failed, retrying in ${retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
      }
    }
  }

  throw lastError || new Error('All retry attempts failed');
}

/**
 * JSON fetch helper
 */
export async function fetchJSON<T = any>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const response = await fetchWithTimeout(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  return response.json();
}

/**
 * POST JSON helper
 */
export async function postJSON<T = any>(
  url: string,
  data: any,
  options: FetchOptions = {}
): Promise<T> {
  return fetchJSON<T>(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * PUT JSON helper
 */
export async function putJSON<T = any>(
  url: string,
  data: any,
  options: FetchOptions = {}
): Promise<T> {
  return fetchJSON<T>(url, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * DELETE helper
 */
export async function deleteRequest<T = any>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  return fetchJSON<T>(url, {
    ...options,
    method: 'DELETE',
  });
}

/**
 * Download file helper
 */
export async function downloadFile(
  url: string,
  options: FetchOptions = {}
): Promise<Blob> {
  const response = await fetchWithTimeout(url, options);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.blob();
}

/**
 * Upload file helper
 */
export async function uploadFile(
  url: string,
  file: File | Blob,
  options: FetchOptions = {}
): Promise<Response> {
  const formData = new FormData();
  formData.append('file', file);

  return fetchWithTimeout(url, {
    ...options,
    method: 'POST',
    body: formData,
  });
}
