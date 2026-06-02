/**
 * apiClient — single switch giữa mock data và real API.
 *
 * Service layer (src/services/*.ts) gọi apiClient.get / post / put / delete.
 * Khi NEXT_PUBLIC_DATA_SOURCE=mock (default): handler được resolve từ registry mock.
 * Khi NEXT_PUBLIC_DATA_SOURCE=api: thực hiện fetch() thật.
 *
 * → Khi ghép BE, không sửa 1 dòng nào trong services hoặc components.
 *   Chỉ cần: 1) đổi env, 2) đảm bảo response BE khớp DTO trong src/types/.
 */

import { env, isMock } from '@config/env';
import { mockRegistry, type MockHandler } from './mockRegistry';

type RequestOptions = {
  params?: Record<string, unknown>;
  signal?: AbortSignal;
};

type BodyOptions<T = unknown> = RequestOptions & {
  body?: T;
};

function buildUrl(path: string, params?: Record<string, unknown>): string {
  const base = env.apiBaseUrl.replace(/\/$/, '');
  const url = new URL(`${base}${path.startsWith('/') ? path : `/${path}`}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') url.searchParams.append(k, String(v));
    });
  }
  return url.toString();
}

async function delay(ms: number) {
  if (ms > 0) await new Promise((r) => setTimeout(r, ms));
}

/** Tìm mock handler match method+path. Hỗ trợ path params dạng `/coaches/:id`. */
function resolveMock(method: string, path: string): { handler: MockHandler; params: Record<string, string> } | null {
  const key = `${method.toUpperCase()} ${path.split('?')[0]}`;
  // exact
  const exact = mockRegistry.get(key);
  if (exact) return { handler: exact, params: {} };
  // pattern match
  for (const [pattern, handler] of mockRegistry.entries()) {
    const [pMethod, pPath] = pattern.split(' ');
    if (pMethod !== method.toUpperCase()) continue;
    const pSegments = pPath.split('/');
    const aSegments = path.split('?')[0].split('/');
    if (pSegments.length !== aSegments.length) continue;
    const params: Record<string, string> = {};
    let ok = true;
    for (let i = 0; i < pSegments.length; i++) {
      const ps = pSegments[i];
      const as = aSegments[i];
      if (ps.startsWith(':')) params[ps.slice(1)] = as;
      else if (ps !== as) { ok = false; break; }
    }
    if (ok) return { handler, params };
  }
  return null;
}

async function mockCall<T>(method: string, path: string, opts: BodyOptions = {}): Promise<T> {
  const matched = resolveMock(method, path);
  if (!matched) {
    throw new Error(`[apiClient/mock] No handler for ${method.toUpperCase()} ${path}`);
  }
  await delay(env.mockLatencyMs);
  const result = await matched.handler({
    pathParams: matched.params,
    query: (opts.params ?? {}) as Record<string, unknown>,
    body: opts.body,
  });
  return result as T;
}

async function realCall<T>(method: string, path: string, opts: BodyOptions = {}): Promise<T> {
  const url = buildUrl(path, opts.params);
  const init: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
    signal: opts.signal,
  };
  if (opts.body !== undefined) init.body = JSON.stringify(opts.body);

  const res = await fetch(url, init);
  if (!res.ok) {
    const errBody = await res.text().catch(() => '');
    throw new Error(`[apiClient] ${method} ${path} failed: ${res.status} ${errBody}`);
  }
  // BE có thể trả 204
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const apiClient = {
  get: <T>(path: string, opts: RequestOptions = {}): Promise<T> =>
    isMock ? mockCall<T>('GET', path, opts) : realCall<T>('GET', path, opts),

  post: <T>(path: string, body?: unknown, opts: RequestOptions = {}): Promise<T> =>
    isMock
      ? mockCall<T>('POST', path, { ...opts, body })
      : realCall<T>('POST', path, { ...opts, body }),

  put: <T>(path: string, body?: unknown, opts: RequestOptions = {}): Promise<T> =>
    isMock
      ? mockCall<T>('PUT', path, { ...opts, body })
      : realCall<T>('PUT', path, { ...opts, body }),

  patch: <T>(path: string, body?: unknown, opts: RequestOptions = {}): Promise<T> =>
    isMock
      ? mockCall<T>('PATCH', path, { ...opts, body })
      : realCall<T>('PATCH', path, { ...opts, body }),

  delete: <T>(path: string, opts: RequestOptions = {}): Promise<T> =>
    isMock ? mockCall<T>('DELETE', path, opts) : realCall<T>('DELETE', path, opts),
};
