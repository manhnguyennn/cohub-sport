# CoHub Sport — MVP Frontend

Nền tảng kết nối học viên với huấn luyện viên thể thao đã xác minh: tìm HLV, đặt buổi 1-1, đăng ký khoá học, chat 2 chiều, và bộ công cụ quản lý cho HLV / Admin.

**Mục đích bản MVP:** (a) demo cho nhà đầu tư, (b) user testing 20–30 người để validate hypothesis.

---

## Tech stack

- **Next.js 14** (App Router) · **TypeScript** strict
- **SCSS** với design tokens v2 (`src/styles/_tokens.scss`)
- **State**: React Context + `localStorage` (không Zustand)
- **Form/validate**: react-hook-form + zod · **Date**: dayjs (locale vi)
- **Charts**: Recharts · **Animation**: Framer Motion (pin v11.x)
- **Icon**: iconsax-reactjs qua wrapper `AppIcon` (KHÔNG dùng emoji — convention §14b)

Toàn bộ dữ liệu chạy qua **mock layer** (`apiClient` + `mockRegistry`). Khi ghép backend thật chỉ cần đổi env, không sửa component/service. Xem [`src/mocks/README.md`](src/mocks/README.md).

---

## Bắt đầu

```bash
npm install
npm run dev          # http://localhost:3000
```

Scripts khác:

```bash
npm run build        # production build
npm run start        # chạy bản build
npm run lint         # next lint (ESLint)
npm run typecheck    # tsc --noEmit
npm run format       # prettier
```

### Biến môi trường (tùy chọn)

| Biến | Mặc định | Ý nghĩa |
|---|---|---|
| `NEXT_PUBLIC_DATA_SOURCE` | `mock` | `mock` dùng dữ liệu giả; `api` gọi backend thật |
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:8080/api/v1` | Base URL backend khi `DATA_SOURCE=api` |
| `NEXT_PUBLIC_MOCK_LATENCY_MS` | `150` | Độ trễ giả lập mỗi request mock |

Không có biến nào bắt buộc để chạy demo — mặc định `mock` hoạt động ngay.

---

## Cấu trúc thư mục

```
src/
├── app/                # App Router routes (pages + layouts)
│   ├── coach/          # CRM HLV (dashboard, sessions, courses, calendar, bookings)
│   ├── admin/          # Admin console (dashboard, reviews)
│   ├── messages/       # Chat 2 chiều
│   ├── notifications/  # Thông báo
│   └── ...             # coaches, courses, booking, checkout, my/*, auth/*
├── components/
│   ├── layout/         # Header, Footer, SiteChrome, DashboardShell, NotificationBell
│   ├── ui/             # Button, Input, EmptyState, Skeleton, AppIcon, Stepper…
│   └── shared/         # TrustStrip, CoachMiniBadge, CancellationPolicy
├── features/           # Logic theo domain (coaches, courses, booking, messages, …)
├── contexts/           # Persona, Toast, DemoMode
├── hooks/              # useAuth (swap BE-ready)
├── services/           # Tầng gọi API (chỉ import qua đây, KHÔNG import mocks)
├── mocks/              # Dữ liệu giả + registerMock (xem mocks/README.md)
├── lib/                # apiClient, mockRegistry, date, area-match, dashboard-routes…
├── config/             # routes.ts (ROUTES), env.ts
├── types/              # DTO dùng chung server/client
└── styles/             # _tokens.scss + blocks/*.scss + globals.scss
```

Hai layout tách biệt: **site chrome** (Header/Footer) cho trang learner-facing, và **dashboard shell** (sidebar + topbar SaaS) cho `/coach/*` + `/admin/*` — quyết định bằng `lib/dashboard-routes.ts`.

Quy ước code đầy đủ ở [`CODING_CONVENTION.md`](CODING_CONVENTION.md); lộ trình build ở [`PLAN.md`](PLAN.md).

---

## Các luồng chính (đã build)

| Khu vực | Route tiêu biểu | Mô tả |
|---|---|---|
| Tìm & đặt HLV | `/coaches`, `/coaches/[id]` | Search/filter (toolbar + modal), lịch dạy mở, đặt buổi (calendar 30 ngày) + đặt lịch riêng |
| Khoá học | `/courses`, `/courses/[id]` | Browse + đăng ký + thanh toán giả |
| Học viên | `/my/bookings`, `/my/courses` | Quản lý buổi tập + khoá; đánh giá sau buổi hoàn thành |
| HLV onboarding | `/become-coach`, `/coach/onboarding` | Wizard 5 bước + xác minh KYC |
| CRM HLV | `/coach/dashboard`, `/coach/bookings`, `/coach/sessions`… | Dashboard, inbox booking, lịch dạy mở, khoá học |
| Admin | `/admin`, `/admin/reviews` | Dashboard + hàng chờ duyệt HLV (SLA, checklist) |
| Communication | `/messages`, `/notifications` | Chat 2 chiều (auto-reply + lọc thông tin liên hệ), thông báo + bell |

---

## Personas & Demo Mode

App không có đăng nhập thật. Trải nghiệm được điều khiển qua **persona** (giả lập 4 loại người dùng) trong **Demo Mode panel**.

**Mở panel:** nhấn `Ctrl + Shift + D`, hoặc thêm `?demo=1` vào URL, hoặc bấm icon ⚙ ở header.

### 4 personas

| Persona | Vai trò | Trạng thái preload |
|---|---|---|
| **Guest** | chưa đăng nhập | visitor lần đầu — không có booking/chat/dashboard |
| **Linh** | Học viên | 1 booking sắp tới + 2 hoàn thành, 1 khoá đang học, 3 hội thoại chat, 8 thông báo |
| **Khoa** | HLV (đã xác minh) | dashboard có data (23 buổi/tháng), 2 booking chờ xác nhận |
| **Admin** | Quản trị | hàng chờ duyệt HLV (3 Tầng 1 + 1 Tầng 2) |

Persona Khoa có dual-role (HLV + học viên) — đổi vai trò qua dropdown user ở header.

### Toggles trong Demo Mode

| Toggle | Tác dụng |
|---|---|
| **Investor mode** | Tăng tốc mọi timer giả lập 5× (5s → 1s) để demo mượt |
| **Slow network** | Làm chậm 3× để test loading state |
| **Force payment fail** | Lần thanh toán kế tiếp = thất bại (test luồng lỗi) |
| **Tắt auto-confirm HLV** | Booking không tự chuyển sang CONFIRMED sau 3s |

Toggles lưu ở `sessionStorage`; persona lưu ở `localStorage`.

> Lưu ý: mock state nằm in-memory và **reset khi điều hướng full-page** (đúng thiết kế cho demo độc lập).

---

## Kịch bản demo

Xem [`DEMO_SCRIPT.md`](DEMO_SCRIPT.md) — storyboard 10 phút cho nhà đầu tư, đi qua cả 3 persona (học viên → HLV → admin).

---

## Lưu ý khi ghép backend

1. Đổi `NEXT_PUBLIC_DATA_SOURCE=api` + set `NEXT_PUBLIC_API_BASE_URL`.
2. Đảm bảo response backend khớp DTO trong `src/types/`.
3. Không cần sửa `services/` hay component — `apiClient` tự chuyển từ mock sang `fetch()` thật.
