# Mock Data Layer — Spec

Toàn bộ dữ liệu của MVP đi qua lớp mock này. Component **không bao giờ** import trực tiếp từ `mocks/` — luôn gọi qua `services/`, services gọi `apiClient`, `apiClient` resolve handler trong registry khi `NEXT_PUBLIC_DATA_SOURCE=mock`.

```
Component → services/*.ts → lib/apiClient.ts → lib/mockRegistry.ts → mocks/*.ts
                                   │
                          (NEXT_PUBLIC_DATA_SOURCE=api → fetch() thật)
```

## Cách hoạt động

- `registerMock('METHOD /path', handler)` đăng ký 1 endpoint. Hỗ trợ path param dạng `/coaches/:id`.
- `handler(ctx)` nhận `ctx = { pathParams, query, body }` và trả về data (sync hoặc Promise).
- `src/mocks/index.ts` import tất cả file mock để đăng ký — file này được import **một lần** ở root layout.
- Độ trễ giả lập: `NEXT_PUBLIC_MOCK_LATENCY_MS` (mặc định 150ms).

> **Quan trọng — state in-memory:** mock chạy trên **cả server lẫn client** với state RIÊNG, không persist. Mọi mutation (tạo booking, gửi tin, duyệt hồ sơ…) chỉ sống trong phiên và **reset khi điều hướng full-page**. Đây là hành vi cố ý cho demo độc lập, không phải bug.

## Quy ước DTO

Mock data dùng đúng tên field mà backend sẽ trả (định nghĩa ở `src/types/`). Khi ghép BE thật chỉ cần response khớp DTO — không sửa service/component.

## Danh sách file & endpoint

| File | Endpoint đăng ký | Ghi chú |
|---|---|---|
| `personas.mock.ts` | — (chỉ data) | 4 persona: guest / linh / khoa / admin + `userMocks` |
| `sports.mock.ts` | `GET /sports`, `GET /sports/:slug` | 17 môn |
| `coaches.mock.ts` | `GET /coaches`, `/featured`, `/:id`, `/:id/courses`, `/:id/similar`, `/:id/rating-distribution` | **50 HLV** (8 literal + 42 generated) |
| `courses.mock.ts` | `GET /courses`, `/featured`, `/:id`, `/:id/sessions`, `POST /:id/enrollments`, `GET /enrollments`, `/enrollments/:id`, `POST /enrollments/:id/cancel`, `GET /coaches/:id/published-courses` | **50 khoá** (13 template) |
| `reviews.mock.ts` | `GET /coaches/:coachId/reviews`, `POST /reviews` | Tạo review = double-blind (`visibleAt = +7d`) |
| `bookings.mock.ts` | `GET /coaches/:coachId/availability`, `GET /bookings`, `/:id`, `POST /bookings`, `PATCH /:id/status`, `POST /:id/cancel` | Hỗ trợ `isCustomRequest` (đặt lịch riêng) |
| `openSession.mock.ts` | `GET/POST /open-sessions`, `/bulk`, `/:id` (GET/PATCH/DELETE), `POST /:id/book` | Lịch dạy mở + recurring expansion |
| `payment.mock.ts` | `POST /payments/charge` | Fake gateway; tôn trọng toggle Force-fail |
| `promo.mock.ts` | `POST /promo/validate` | `DEMO50` (-50k), `INVALID` (lỗi) |
| `onboarding.mock.ts` | `POST /coaches/onboarding/submit`, `/verification/submit` | Auto-approve có delay |
| `dashboard.mock.ts` | `GET /coach/dashboard` | Stats persona Khoa (revenue 30d trend tăng) |
| `admin.mock.ts` | `GET /admin/stats`, `/reviews`, `POST /reviews/:id/decide` | 4 hồ sơ chờ (3 Tier1 + 1 Tier2) |
| `chats.mock.ts` | `GET /messages/threads`, `/:id`, `POST /:id/messages`, `/:id/auto-reply` | 3 thread persona Linh + auto-reply 2s |
| `notifications.mock.ts` | `GET /notifications`, `PATCH /:id/read`, `POST /read-all` | Per persona (Linh 8 / Khoa 6 / Admin 4) |
| `auth.mock.ts` | `POST /auth/login`, `/register`, `GET /auth/me` | OTP `111111` = fail, số khác = pass |

## Thêm endpoint mock mới

1. Tạo/sửa file trong `src/mocks/`, gọi `registerMock('GET /your-path', handler)`.
2. Nếu là file mới → thêm `import './your-file.mock';` vào `src/mocks/index.ts`.
3. Định nghĩa DTO trả về trong `src/types/`.
4. Thêm method tương ứng trong `src/services/*.ts` (chỉ dùng `apiClient`).
