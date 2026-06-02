/**
 * Mock registry — map từ "METHOD /path" → handler function.
 *
 * Các file mock data (src/mocks/*.ts) gọi `registerMock(...)` để đăng ký.
 * apiClient tự resolve khi NEXT_PUBLIC_DATA_SOURCE=mock.
 *
 * Hỗ trợ path params dạng `/coaches/:id` — apiClient sẽ inject vào pathParams.
 */

export type MockContext = {
  pathParams: Record<string, string>;
  query: Record<string, unknown>;
  body?: unknown;
};

export type MockHandler = (ctx: MockContext) => unknown | Promise<unknown>;

export const mockRegistry = new Map<string, MockHandler>();

export function registerMock(pattern: string, handler: MockHandler): void {
  mockRegistry.set(pattern, handler);
}
