/**
 * Centralized env access. Đọc env một chỗ duy nhất, log warning nếu thiếu.
 */

type DataSource = 'mock' | 'api';

const dataSourceRaw = process.env.NEXT_PUBLIC_DATA_SOURCE as DataSource | undefined;

export const env = {
  dataSource: (dataSourceRaw === 'api' ? 'api' : 'mock') as DataSource,
  apiBaseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080/api/v1',
  mockLatencyMs: Number(process.env.NEXT_PUBLIC_MOCK_LATENCY_MS ?? 150),
} as const;

export const isMock = env.dataSource === 'mock';
