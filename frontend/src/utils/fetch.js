// frontend/src/utils/fetch.js

let inMemoryAccessToken = null;

export const setAccessToken = (token) => { inMemoryAccessToken = token || null; };
export const clearAccessToken = () => { inMemoryAccessToken = null; };
export const getAccessToken = () => inMemoryAccessToken;

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const REFRESH_URL =
  import.meta.env.VITE_REFRESH_URL || `${BASE_URL}/auth/refresh`;
const WITH_CREDENTIALS =
  (import.meta.env.VITE_API_WITH_CREDENTIALS || "true") === "true";
const DEFAULT_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 10000;

/**
 * Build url with optional query params
 */
function buildUrl(path, params) {
  const base = path.startsWith("http") ? path : `${BASE_URL}${path}`;
  if (!params) return base;
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (Array.isArray(v)) v.forEach((item) => usp.append(k, item));
    else usp.set(k, String(v));
  });
  const qs = usp.toString();
  return qs ? `${base}?${qs}` : base;
}

/**
 * Normalize headers and body for JSON or FormData
 */
function normalizeRequest(method, body, headers = {}) {
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  const baseHeaders = { ...headers };
  if (!isFormData && body != null && !baseHeaders["Content-Type"]) {
    baseHeaders["Content-Type"] = "application/json";
  }

  const payload = isFormData
    ? body
    : body != null
      ? JSON.stringify(body)
      : undefined;

  return { method, headers: baseHeaders, body: payload };
}

/**
 * Core request with optional 401 refresh + retry
 */
async function coreFetch(path, {
  method = "GET",
  params,
  body,
  headers,
  timeout = DEFAULT_TIMEOUT,
  retryOn401 = true,
  signal,
  parse = "json", // "json" | "text" | "blob" | "none"
} = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new DOMException("Timeout", "AbortError")), timeout);
  const combinedSignal = signal ? new AbortController() : null;

  if (combinedSignal) {
    signal.addEventListener("abort", () => combinedSignal.abort(), { once: true });
  }

  const url = buildUrl(path, params);

  const reqInit = normalizeRequest(method, body, headers);

  // Credentials (cookies) for refresh flow if backend uses HttpOnly cookie
  if (WITH_CREDENTIALS) reqInit.credentials = "include";

  // Attach Authorization header if token exists
  if (inMemoryAccessToken) {
    reqInit.headers = {
      ...reqInit.headers,
      Authorization: `Bearer ${inMemoryAccessToken}`,
    };
  }

  let res;
  try {
    res = await fetch(url, { ...reqInit, signal: combinedSignal ? combinedSignal.signal : controller.signal });
  } catch (e) {
    clearTimeout(timer);
    throw e;
  }

  // If unauthorized and allowed to retry, attempt refresh
  if (res.status === 401 && retryOn401) {
    const refreshed = await refreshToken();
    if (refreshed) {
      // retry original call once
      return coreFetch(path, { method, params, body, headers, timeout, retryOn401: false, signal, parse });
    }
  }

  clearTimeout(timer);

  // Handle non-2xx
  if (!res.ok) {
    let errorData = null;
    try { errorData = await res.clone().json(); } catch {}
    const err = new Error(errorData?.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = errorData;
    throw err;
  }

  // Parse response
  if (parse === "none") return res;
  if (parse === "text") return res.text();
  if (parse === "blob") return res.blob();
  return res.status === 204 ? null : res.json();
}

/**
 * Try to refresh token using cookie-based refresh endpoint
 * Expects: { accessToken } JSON
 */
async function refreshToken() {
  try {
    const res = await fetch(REFRESH_URL, {
      method: "POST",
      credentials: WITH_CREDENTIALS ? "include" : "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (data?.accessToken) {
      setAccessToken(data.accessToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Public API
 */
export const http = {
  get: (path, opts = {}) =>
    coreFetch(path, { ...opts, method: "GET" }),

  delete: (path, opts = {}) =>
    coreFetch(path, { ...opts, method: "DELETE" }),

  post: (path, body, opts = {}) =>
    coreFetch(path, { ...opts, method: "POST", body }),

  put: (path, body, opts = {}) =>
    coreFetch(path, { ...opts, method: "PUT", body }),

  patch: (path, body, opts = {}) =>
    coreFetch(path, { ...opts, method: "PATCH", body }),

  // File upload (FormData)
  upload: (path, formData, opts = {}) =>
    coreFetch(path, {
      ...opts,
      method: "POST",
      body: formData, // do NOT set Content-Type; browser sets multipart boundary
    }),

  // Download as Blob
  download: (path, opts = {}) =>
    coreFetch(path, { ...opts, method: "GET", parse: "blob" }),
};
